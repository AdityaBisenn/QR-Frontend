async function dbRequest(hashVal){
    const apiUrl = `https://qr-backend-production.up.railway.app/checkHash/`;

    let data = { hashVal: hashVal };

    return fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then((response) => {
        console.log(response)
        if (response.status === 401){
            return response.json()
        }


        return response.json()
    })
    .catch((error) => {
        console.error('Error:', error);
        return 'dbError'
    });

}

const showLoader = document.getElementById('showLoader');


function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete"
        || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}



// async function dbCheck(hashVal){
//     const apiUrl = `http://localhost:4545/checkHash/${hashVal}`;
//     try {
//         const response = await fetch(apiUrl);
//         if (!response.ok) {
//             throw new Error('Network response was not ok.');
//         }
//         const data = await response.json();

//         console.log(data)
//         return (data.exists);
//     } catch (error) {
//         // Handle any error that occurred during the fetch
//         return 'dbError'
//     }

// }

function alerter(title, body, icon){
    
    swal({
        title: title,
        text: body,
        icon: icon,
    }).then(() => {
        scanObject.lastResult = undefined;
        scanObject.countResults = 0;
    })
}

const qrScanApi = async (decodedText, scanObject) => {
    showLoader.style.display = 'flex';

    // const apiResponse = await dbCheck(decodedText)
    const apiResponse = await dbRequest(decodedText)
    console.log("api resonse", apiResponse)

    showLoader.style.display = 'none';

    if (apiResponse.error) alerter("Unauthorized", apiResponse.error, "error" )
    else if (apiResponse === "dbError") alerter("Please Try Again", "Sorry for the inconvinience", "warning")
    else alerter("Verified", `Entry No : ${apiResponse.EntryNo}`, "success")
}

docReady(function () {
    // var resultContainer = document.getElementById('qr-reader-results');
    const scanObject = {
        lastResult: undefined,
        countResults: 0
    }
    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== scanObject.lastResult) {
            ++scanObject.countResults;
            scanObject.lastResult = decodedText;

            // Handle on success condition with the decoded message.
            console.log(`Scan result ${decodedText}`, decodedResult);
            qrScanApi(decodedText, scanObject);
        }
    }

    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);
});