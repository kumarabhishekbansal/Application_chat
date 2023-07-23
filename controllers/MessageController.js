const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");

// create one to one chat

// const createOneToOneChat=async(req,res)=>{
//   try {
//     const {chaterId}=req.body;
//     const userId=req.user._id;

//     var isChat = await Chat.find({
//       isGroupChat: false,
//       $and: [
//         { users: { $elemMatch: { $eq: userId } } },
//         { users: { $elemMatch: { $eq: chaterId } } },
//       ],
//     })

//     if(isChat)
//     {
//       return res.status(402).json({
//         message:"Chat exits"
//       })
//     }
//     const creating=await Chat.create({
//       chatName:"sender",
//       isGroupChat: false,
//       users: [req.user._id, userId]
//     });
//     if(creating)
//     {
//       return res.status(201).json({
//         message:"chat created successfully",
//         data:creating
//       });
//     }
//     return res.status(400).json({
//       message:"chat can not be created"
//     })
//   } catch (error) {
//     console.log("error occurs while createOneToOneChat");
//   }
// }

const createOrUpdateMessage = async (req, res) => {
  try {
    console.log("enter createOrUpdateMessage");
    const { chaterId, content } = req.body;
    const userId = req.user._id;
    const senderId = userId;
    // console.log(chaterId, content, userId, senderId);
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: chaterId } } },
      ],
    });

    if (isChat.length > 0) {
      // console.log("enter if isChat ");
      const chatExistsId = isChat[0]._id;
      // console.log("chatExistsId ",chatExistsId);
      let date_ob = new Date();
      let hours = date_ob.getHours();
      let minutes = date_ob.getMinutes();
      const messagesender = {
        SenderId: senderId,
        content: content,
        date:hours+" : "+minutes
      };

      const messagechatfound = await Message.updateOne(
        { chat: chatExistsId },
        {
          $push: { MessageSender: messagesender },
        },
        {
          new: true,
        }
      );

      if (messagechatfound) {
        // console.log("enter messagechat found ",messagechatfound);
        return res.status(201).json({
          message: "Message add with existing chatId",
          data: messagechatfound,
        });
      } else {
        return res.status(402).json({
          message: "Message can not be added",
        });
      }
    }
    const creating = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [userId, chaterId],
    });
    if (creating) {
      const chatId = creating._id;
      let date_ob = new Date();
      let hours = date_ob.getHours();
      let minutes = date_ob.getMinutes();
      const messagesender = {
        SenderId: senderId,
        content: content,
        date:hours+" : "+minutes
      };
      const messagecreate = await Message.create({
        chat: chatId,
        MessageSender: messagesender,
      });

      if (messagecreate) {
        // console.log("messagecreate ", messagecreate);
        return res.status(201).json({
          message: "Message created with new chat id",
          data: messagecreate,
        });
      } else {
        return res.status(402).json({
          message: "Message can not be created",
        });
      }
    }
    return res.status(400).json({
      message: "chat can not be created",
    });
  } catch (error) {
    // console.log(error);
    console.log("error occurs while createOneToOneChat");
  }
};

// get all messages with chater id and (user id)
const allMessagesOfChat = async (req, res) => {
  try {
    // console.log("enter allMessagesOfChat");
    // console.log("req.params.chatId ", req.params.chaterId);
    const chaterId = req.params.chaterId;
    const userId = req.user._id;
    // console.log("chaterId userId ", chaterId, userId);
    // const messages = await Message.find({ chat: req.params.chatId })
    const findChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: chaterId } } },
      ],
    });
    if (findChat.length > 0) {
      // console.log("findChat ", findChat);
      const findmessages = await Message.find({ chat: findChat[0]._id });
      if (findmessages.length > 0) {
        // console.log("findmessages ", findmessages);
        return res.status(200).json({
          message:"getting messages",
          data:findmessages
        })
      } else {
        console.log("not messages found");
        return res.status(400).json({
          message:"Messages not found",
        })
      }
    } else {
      console.log("No chats found");
      return res.status(402).json({
        message:"Chat not found",
      })
    }
  } catch (error) {
    console.log("error while getting allMessagesOfChat");
  }
};

// get all messages
//@route           GET /api/Message/:chatId

const allMessages = asyncHandler(async (req, res) => {
  try {
    console.log("req.params.chatId ", req.params.chatId);
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    if (messages) {
      res.status(200).json({
        message: "getting messages",
        data: messages,
      });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// create new messages

//@route           POST /api/Message/

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  // console.log("content,chatId ",content,chatId);
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400).json({
      message: "Invalid data passed into request",
    });
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    const findIsChatexists = await Chat.findById(chatId._id);

    if (findIsChatexists) {
      // console.log("message_ ",message);
      var message = await Message.create(newMessage);
      // console.log("message1 ",message);
      message = await message.populate("sender", "name pic");
      // console.log("message2 ",message);
      message = await message.populate("chat");
      console.log("message3 ", message);
      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });
      console.log("message ", message);
      await Chat.findByIdAndUpdate(req.body.chatId._id, {
        latestMessage: message,
      });
    } else {
      // create chat with that user
    }

    if (message) {
      res.status(200).json({
        message: "getting messages",
        data: message,
      });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = {
  allMessages,
  sendMessage,
  createOrUpdateMessage,
  allMessagesOfChat,
};
