import axios from "axios";
import parseCurl from "parse-curl";

const curl = `curl --location 'http://localhost:3900/mcs/property/v1/recieve/payment' \
--header 'Accept: application/json' \
--header 'Accept-Language: en-US,en;q=0.9,hi;q=0.8' \
--header 'Authorization: Bearer 20ba428d39b535cd4245bd80fe21e7109254739def690b065e1b7a82f7ba8b057c2a53091ed94f89e168d81c69703a8cc06b010993f8d13556c58a18c768e9cd1f2cf87e834c63b65c550c521face245441c4f579650ced7a3e6c1760854921aa52346758ffbcd9dd343c85f59db2aff1a5b870d0974d514c0367847f2bd49fb595e8f2fbc8a3c8a78ad1dc2d7e41d44aca87c2f97fb1d1c0e53e1295b4e319c08f9f0e9d334386a34ef8dc602fb2b50f694397a5ddb94051e151ca48a945380cfefde2b255672ccd703394ce0df3ea1' \
--header 'Connection: keep-alive' \
--header 'Content-Type: application/json' \
--header 'Referer: http://localhost:8080/' \
--header 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36' \
--header 'qp-tc-request-id: dNC91D4P-EWIB-WEUIWB-34NJDJBS' \
--data '{
    "bill_no": "202739",
    "payment_details": {
        "amount": 924080.4,
        "paymode": "1",
        "bank_name": "ALLAHABAD BANK",
        "cheque_no": null,
        "payment_status": "Success",
        "bank_id": 1,
        "interest": 0,
        "penality": 0
    }
}'`



async function callAPI(curl: any){
    try {
        const parsedCurl = parseCurl(curl)
        const response = await axios({
            method: parsedCurl.method,
            url: parsedCurl.url,
            headers: parsedCurl.header,
            data: JSON.parse(parsedCurl.body)
        })
        return response.data
    } catch (error) {
        return error
    }
}

const result = await callAPI(curl)
console.log(result);
