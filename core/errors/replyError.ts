function replyWithErrorMessage(message: object){
    const statusCode = 400;
    const error = {
        type: "error",
        success: false,
        message: message || 'Something went wrong',
    }
}