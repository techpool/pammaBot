
/* Function to handle reply */

function handleReply(app, userResponse) {
    if (ReplyDetector.type) {
        switch (ReplyDetector.type) {
            case 'multidelete':
                StoreAndRetrieve.deleteMessage(ReplyDetector.type, app, userResponse);
                break;
            case 'newmessage':
                StoreAndRetrieve.saveNewDoc(app, userResponse);
                break;
            case 'addtitle':
                StoreAndRetrieve.updateTitle(app, userResponse);
                break;
            default:

        }
    } else {
        switch (userResponse.reply_to_message.text) {
            case 'Tell me the title':
                StoreAndRetrieve.forwardMessage(app, userResponse);
                break;
            case 'Give me the title to delete':
                StoreAndRetrieve.deleteMessage(ReplyDetector.type, app, userResponse);
                break;
            default:
                console.log('I don"t understand her.');

        }
    }
}

module.exports = {
    handleReply: handleReply
}
