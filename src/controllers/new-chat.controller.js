import { Meteor } from 'meteor/meteor';
import { Chats } from 'api/collections';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class NewChatCtrl extends Controller {
  static $inject = ['$state', 'NewChat', '$ionicPopup', '$log']

  constructor() {
    super(...arguments);

    this.helpers({
      users() {
        return Meteor.users.find({ _id: { $ne: this.currentUserId } });
      }
    });
  }

  newChat(userId) {
    let chat = Chats.findOne({ userIds: { $all: [this.currentUserId, userId] } });

    if (chat) {
      this.hideNewChatModal();
      return this.goToChat(chat._id);
    }

    this.callMethod('newChat', userId, (err, chatId) => {
      this.hideNewChatModal();
      if (err) return this.handleError(err);
      this.goToChat(chatId);
    });
  }

  hideNewChatModal() {
    this.NewChat.hideModal();
  }

  goToChat(chatId) {
    this.$state.go('tab.chat', { chatId });
  }

  handleError(err) {
    this.$log.error('New chat creation error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'New chat creation failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
}

NewChatCtrl.$name = 'NewChatCtrl';