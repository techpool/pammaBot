
/* Function to handle reply */

function handleReply(app, userResponse) {
    switch (userResponse.reply_to_message.text) {
        case 'Please give me what you want me to store.':
            StoreAndRetrieve.saveNewDoc(app, userResponse);
            break;
        case 'Please give me a title':
            StoreAndRetrieve.updateTitle(app, userResponse);
            break;
        case 'Tell me the title':
            StoreAndRetrieve.forwardMessage(app, userResponse);
            break;
        default:
            console.log('I don"t understand her.');

    }
}

module.exports = {
    handleReply: handleReply
}
