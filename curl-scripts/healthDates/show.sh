#!/bin/sh

API="http://localhost:8000"
URL_PATH="/dates"

curl "${API}${URL_PATH}/${ID}" \
    --include \
    --request GET \
    --header "Authorization: Bearer ${TOKEN}"

echo
