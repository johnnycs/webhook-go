package model

type Change struct {
	Field 	string 			`json:"field"`
	Value 	interface{} `json:"value"`
	Id 			string 			`json:"id"`
	Verb 		string 		 	`json:"verb"`
}

type EntryValue struct {
	Time          int      `json:"time"`
	ID            string   `json:"id"`
	// ChangedFields []string `json:"changed_fields"`
	UID           string   `json:"uid"` // fb user id
	Changes 			[]Change `json:"changes"`
}

// PostJSON struct which marshals a JSON object
// when an event we are subscribed to occurs
type FacebookData struct {
	Entry 				[]EntryValue `json:"entry"`
	Object 				string `json:"object"`
}


type WebhookData struct {
	id, field, uid, value			string
	changeId, verb, eventId		string
}
