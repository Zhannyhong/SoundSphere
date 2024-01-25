package api

import (
	"encoding/json"
	"errors"
	"github.com/go-chi/render"
	"io"
	"net/http"
)

// Response payload mostly follows JSend's specification, but fail status returns more information in the message instead of the data field
type Response struct {
	Status  string      `json:"status"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
}

func Respond(w http.ResponseWriter, r *http.Request, status int, data Response) {
	render.Status(r, status)
	render.JSON(w, r, data)
}

// ReturnPayload When an API call is successful
func ReturnPayload(w http.ResponseWriter, r *http.Request, status int, data interface{}) {
	var payload Response
	payload.Status = "success"
	payload.Data = data
	Respond(w, r, status, payload)
}

// ReturnFailure When an API call is rejected due to invalid data or call conditions
func ReturnFailure(w http.ResponseWriter, r *http.Request, status int, data interface{}) {
	var payload Response
	payload.Status = "fail"
	payload.Data = data
	Respond(w, r, status, payload)
}

// ReturnError When an API call fails due to an error on the server
func ReturnError(w http.ResponseWriter, r *http.Request, status int, err error) {
	var payload Response
	payload.Status = "error"
	payload.Message = err.Error()
	Respond(w, r, status, payload)
}

func ReadJSON(w http.ResponseWriter, r *http.Request, data interface{}) error {
	maxBytes := 1024 * 1024
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	err := dec.Decode(data)
	if err != nil {
		return err
	}

	err = dec.Decode(&struct{}{})
	if err != io.EOF {
		return errors.New("Body must only contain a single JSON value")
	}

	return nil
}
