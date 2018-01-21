package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"
	"strings"
	"github.com/johnnycs/gowebhook/model"
	"github.com/rs/cors"
	"goji.io"
	"goji.io/pat"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)
const (
	hosts    = "DB EXT IP ADRS"
	database = "DBNAME"
	username = "ADMIN NAME"
	password = "BITNAMI PWD"
)

func ErrorWithJSON(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	fmt.Fprintf(w, "{message: %q}", message)
}

func ResponseWithJSON(w http.ResponseWriter, json []byte, code int) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	w.Write(json)
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	info := &mgo.DialInfo{
		Addrs:    []string{hosts},
		Timeout:  60 * time.Second,
		Database: database,
		Username: username,
		Password: password,
	}

	session, err := mgo.DialWithInfo(info)
	if err != nil {
		panic(err)
	}
	defer session.Close()

	session.SetMode(mgo.Monotonic, true)
	ensureIndex(session)

	mux := goji.NewMux()
	mux.HandleFunc(pat.Get("/facebook"), VerifyFacebook)
	mux.HandleFunc(pat.Post("/facebook"), AddFacebookData(session))
	mux.HandleFunc(pat.Get("/userInteraction"), GetFacebookData(session))
	handler := cors.Default().Handler(mux)
	http.ListenAndServe(":"+port, handler)
}

func ensureIndex(s *mgo.Session) {
	session := s.Copy()
	defer session.Close()

	c := session.DB("webhook").C("userInteraction")

	index := mgo.Index{
		Key:        []string{"id"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}
	err := c.EnsureIndex(index)
	if err != nil {
		panic(err)
	}
}

func VerifyFacebook(w http.ResponseWriter, r *http.Request) {
	if r.FormValue("hub.mode") == "subscribe" &&
		r.FormValue("hub.verify_token") == "token" {
		w.Write([]byte(r.FormValue("hub.challenge")))
	} else {
		w.Write([]byte("400"))
	}
}

func GetFacebookData(s *mgo.Session) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		session := s.Copy()
		defer session.Close()
		c := session.DB("webhook").C("userInteraction")
		conditions := bson.M{}
		wid, ok := r.URL.Query()["id"]
		if ok && len(wid) > 0 {
			conditions["wid"] = wid[0]
		}
		search, ok := r.URL.Query()["search"]
		if ok && len(search) > 0 {
        conditions["wid"] = bson.RegEx{search[0], "i"}
    }
		fields, ok := r.URL.Query()["fields"]
		if ok && len(fields) > 0 {
			log.Println("no 'fields'")
			fieldsArr := strings.Split(fields[0], ",")
			var filters []bson.M
			for i := range fieldsArr {
					var curFilter = bson.M{"field":fieldsArr[i]}
					filters = append(filters, curFilter)
			}
			conditions["$or"] = filters
		}
		var webhookDataList []map[string]interface{}
		err := c.Find(conditions).All(&webhookDataList)
		if err != nil {
			ErrorWithJSON(w, "Database error", http.StatusInternalServerError)
			log.Println("Failed get all userInteraction: ", err)
			return
		}
		respBody, err := json.MarshalIndent(webhookDataList, "", "  ")
		if err != nil {
			log.Fatal(err)
		}
		ResponseWithJSON(w, respBody, http.StatusOK)
	}
}

func AddFacebookData(s *mgo.Session) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		session := s.Copy()
		defer session.Close()
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			fmt.Println(err)
		}
		log.Println("body =",string(body))
		var facebookData model.FacebookData
		err = json.Unmarshal(body, &facebookData)
		if err != nil {
			fmt.Println("err", err)
		}

		webhookData := make(map[string]interface{})

		wid := facebookData.Entry[0].ID
		wuid := facebookData.Entry[0].UID
		field := facebookData.Entry[0].Changes[0].Field
		value := facebookData.Entry[0].Changes[0].Value
		verb := facebookData.Entry[0].Changes[0].Verb
		webhookData["_id"] = bson.NewObjectId()
		objectId := webhookData["_id"]
		str, _ := objectId.(bson.ObjectId)
		webhookData["id"] = str.Hex()
		webhookData["wid"] = wid
		webhookData["wuid"] = wuid
		webhookData["field"] = field
		webhookData["value"] = value
		webhookData["verb"] = verb

		c := session.DB("webhook").C("userInteraction")
		err = c.Insert(webhookData)
		if err != nil {
			log.Println("Failed insert userInteraction: ", err)
			return
		}
		response, err := json.Marshal(webhookData)
		if err != nil {
			panic(err)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		w.Write(response)
	}
}
