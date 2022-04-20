import Theme from "../../Theme/Theme"

const getDocumentStatus = (status) => {
    if (status === "P") {
        // if document status is in progress
        return {
            icon: "alert-circle",
            color: Theme.BLUE_COLOR,
            message: "Document verification is in progress"
        }
    } else if (status === "V") {
        // if document status is verified
        return {
            icon: "checkmark-circle",
            color: Theme.GREEN_COLOR,
            message: "Verified"
        }
    } else if (status === "NV") {
        // if document status is not verfied(due to some err)
        return {
            icon: "close-circle",
            color: Theme.RED_COLOR,
            message: "Please upload your document again because your document can't be verified"
        }
    } else {
        // if document status is null (no document uploaded yet)
        return {
            icon: "help-circle",
            color: Theme.BORDER_COLOR,
            // message: "Please upload your document to complete verification"
        }
    }
}

export default getDocumentStatus;