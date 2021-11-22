import { aql } from 'arangojs'
import bcrypt from 'bcrypt'

export const resolvers = {
  Query: {
    currentUser: (parent, args, context) => context.getUser(),
    getMyFriendRequests: async (parent, args, context) => {
      const currentUser = context.getUser()

      if (!currentUser) {
        console.log(`Attempt to get users without user account`)
        throw new Error(`Unable to find your account, please log in`)
      }

      let friendRequests
      try {
        friendRequests = await (
          await context.db.query(aql`
            WITH users
            FOR vertex, edge IN 1..1 INBOUND ${currentUser._id} friendRequests RETURN {
            "_id": edge._id,
            "from": {
              "_id": vertex._id,
              "firstName": vertex.firstName,
              "lastName": vertex.lastName
            },
            "to": ${currentUser},
            }
        `)
        ).all()
      } catch (error) {
        console.log(
          `Error while retrieving friend requests for user "${currentUser._id}": ${error}`,
        )
        throw new Error(`Error while retrieving friend requests`)
      }

      return friendRequests
    },
    getMyFriends: async (parent, { offset, limit }, context) => {
      const currentUser = context.getUser()

      if (!currentUser) {
        console.log(`Attempt to get users without user account`)
        throw new Error(`Unable to find your account, please log in`)
      }

      // get friends
      let friends
      try {
        console.log(
          `User "${currentUser._id}" attempting to retrieve their friends`,
        )
        friends = await (
          await context.db.query(aql`
            WITH users, friends
            FOR vertex, edge IN 1..1 ANY ${currentUser._id} friends RETURN {
            "_id": vertex._id,
            "firstName": vertex.firstName,
            "lastName": vertex.lastName }  
            `)
        ).all()
      } catch (error) {
        console.log(
          `Error while user "${currentUser._id}" attempted to retrieve their friends: ${error}`,
        )
        throw new Error(
          `Error while retrieving your friends, please try again.`,
        )
      }

      console.log(
        `User "${currentUser._id}" successfully retrieved their friends`,
      )

      return friends
    },
    getMyTools: async (parent, { offset, limit }, context) => {
      const currentUser = context.getUser()

      if (!currentUser) {
        console.log(`Attempt to get tools without user account`)
        throw new Error(`Unable to find your account, please log in`)
      }

      // get tools
      let tools
      try {
        console.log(
          `User "${currentUser._id}" attempting to retrieve their tools`,
        )
        tools = await (
          await context.db.query(aql`
            WITH users, tools
            FOR vertex, edge IN 1..1 OUTBOUND ${currentUser._id} toolClaims RETURN MERGE(
              vertex,
              { "owner": ${currentUser} })
            `)
        ).all()
      } catch (error) {
        console.log(
          `Error while user "${currentUser._id}" attempted to retrieve their tools: ${error}`,
        )
        throw new Error(`Error while retrieving your tools, please try again.`)
      }

      console.log(
        `User "${currentUser._id}" successfully retrieved their tools`,
      )

      return tools
    },
  },
  Mutation: {
    answerFriendRequest: async (
      parent,
      { answer, friendRequestId },
      context,
    ) => {
      const currentUser = context.getUser()

      if (!currentUser) {
        console.log(`Attempt to accept friend request without user account`)
        throw new Error(`Unable to find your account, please log in`)
      }

      // grab friend request
      let friendRequest
      try {
        friendRequest = await context.db
          .collection('friendRequests')
          .document(friendRequestId)
      } catch (error) {
        console.log(
          `User "${currentUser._id}" attempted to accept non-existing friend request "${friendRequestId}"`,
        )
        throw new Error(`Unable to answer this friend request`)
      }

      // check if friend request is for current user
      if (friendRequest._to !== currentUser._id) {
        console.log(
          `User "${
            currentUser._id
          }" attempted to accept friend request not to them: "${JSON.stringify(
            friendRequest,
          )}"`,
        )
        throw new Error(`Unable to accept this friend request.`)
      }

      // check if current friendship already exists
      let currentFriendship
      try {
        const friendArray = [friendRequest._from, friendRequest._to]
        currentFriendship = await (
          await context.db.query(aql`
          FOR friend IN friends FILTER friend._from IN ${friendArray} AND friend._to IN ${friendArray} RETURN friend
        `)
        ).next()
      } catch (error) {
        console.log(
          `Error while checking if friendship exists during answering of friend request ${friendRequestId}: ${error}`,
        )
      }
      if (currentFriendship) {
        console.log(
          `User "${currentUser._id}" attempted to answer friend request "${friendRequestId}" but the users are already friends`,
        )
        throw new Error(`Already friends with this user`)
      }

      // create friendship if user accepted friend request
      if (answer === 'ACCEPT') {
        try {
          await context.db
            .collection('friends')
            .save({ _from: friendRequest._from, _to: friendRequest._to })
        } catch (error) {
          console.log(
            `Error when user "${currentUser._id}" attempted to accept friend request for "${friendRequest._from}" and "${friendRequest._to}": ${error}`,
          )
          throw new Error(`Unable to add friend`)
        }
      }

      // remove friend requests to each party from each party
      const friendIdArray = [currentUser._id, friendRequest._from]
      try {
        await (
          await context.db.query(aql`
        FOR friendRequest IN friendRequests FILTER friendRequest._from IN ${friendIdArray} AND friendRequest._to IN ${friendIdArray} REMOVE friendRequest IN friendRequests
      `)
        ).next()
      } catch (error) {
        console.log(
          `Error while user "${currentUser._id}" attempted to answer friend request "${friendRequestId}" during removal of old friend requests: ${error}`,
        )
      }

      // request successfully sent
      console.log(
        `User "${
          currentUser._id
        }" successfully accepted friend request "${JSON.stringify(
          friendRequest,
        )}"`,
      )
      return friendRequest
    },
    addFriend: async (parent, { friendId }, context) => {
      const currentUser = context.getUser()

      if (!currentUser) {
        console.log(`Attempt to add friend without user account`)
        throw new Error(`Unable to find your account, please log in`)
      }

      if (friendId === currentUser._id) {
        console.log(
          `User "${friendId}" attempted to send themself a friend request`,
        )
        throw new Error(`Cannot send yourself a friend request`)
      }

      // Grab user to receive friend request
      let newFriend
      try {
        console.log(
          `User "${currentUser._id}" to add new friend "${friendId}", grabbing friend user`,
        )
        newFriend = await context.db.collection('users').document(friendId)
      } catch (error) {
        console.log(
          `Error when user "${currentUser._id}" attempted to add new friend "${friendId}" during friend user retrieval: ${error}`,
        )
        throw new Error(error)
      }

      // Check if users are already friends
      let currentFriendship
      try {
        const friendArray = [currentUser._id, friendId]
        currentFriendship = await (
          await context.db.query(aql`
          FOR friend IN friends FILTER friend._from IN ${friendArray} AND friend._to IN ${friendArray} RETURN friend
        `)
        ).next()
      } catch (error) {
        console.log(
          `Error while checking if friendship exists during sending of friend request from "${currentUser._id}" to "${newFriend._id}": ${error}`,
        )
      }
      if (currentFriendship) {
        console.log(
          `User "${currentUser._id}" attempted to send friend request to "${newFriend._id}" but the users are already friends`,
        )
        throw new Error(`Already friends with this user`)
      }

      // remove old friend requests if they exist
      try {
        console.log(
          `User "${currentUser._id}" to add new friend "${friendId}", removing old friend requests`,
        )
        await (
          await context.db.query(aql`
          FOR friendRequest IN friendRequests FILTER friendRequest._from == ${currentUser._id} 
            AND friendRequest._to == ${friendId} 
            REMOVE friendRequest IN friendRequests
        `)
        ).all()
      } catch (error) {
        console.log(
          `Error when user "${currentUser._id}" attempted to add new friend "${friendId}" during removal of all friend requests: ${error}`,
        )
        throw new Error(error)
      }

      // send friend request
      try {
        console.log(
          `User "${currentUser._id}" to add new friend "${friendId}", sending request`,
        )
        await context.db
          .collection('friendRequests')
          .save({ _from: currentUser._id, _to: friendId, seen: false })
      } catch (error) {
        console.log(
          `Error when user "${currentUser._id}" attempted to add new friend "${friendId}" during request creation: ${error}`,
        )
        throw new Error(error)
      }

      console.log(
        `User "${currentUser._id}" successfully sent friend request to "${friendId._id}"`,
      )

      // request successfully sent
      return 'Friend request successfully sent'
    },
    addTool: async (
      parent,
      { name, color, brand, photos, description, privacy },
      context,
    ) => {
      const currentUser = context.getUser()

      const toolInfo = {
        name: name.trim(),
        color: color.trim(),
        brand: brand.trim(),
        photos,
        description: description.trim(),
        privacy,
      }
      let newTool
      try {
        console.log(`User "${currentUser._id}" attempting to insert new tool`)
        newTool = await context.db.collection('tools').save(toolInfo)
      } catch (error) {
        console.log(
          `Error when user "${
            currentUser._id
          }" attempted to insert tool with info "${JSON.stringify(
            toolInfo,
          )}": ${error}`,
        )
        throw new Error(error)
      }
      console.log(
        `New tool inserted by "${currentUser._id}": ${JSON.stringify(newTool)}`,
      )

      let toolClaim
      try {
        console.log(
          `Adding claim between new tool "${newTool._id}" and user "${currentUser._id}"`,
        )
        toolClaim = await context.db
          .collection('toolClaims')
          .save({ _from: currentUser._id, _to: newTool._id })
      } catch (error) {
        console.log(
          `Error when creating claim for tool "${JSON.stringify(
            newTool,
          )}": ${error}`,
        )
        throw new Error(error)
      }

      console.log(
        `New claim between new tool "${newTool._id}" and user "${
          currentUser._id
        }" created: "${JSON.stringify(toolClaim)}"`,
      )

      return newTool
    },
    login: async (parent, { email, password }, context) => {
      const { user } = await context.authenticate('graphql-local', {
        email: email.trim(),
        password: password.trim(),
      })
      await context.login(user)
      return { user }
    },
    logout: (parent, args, context) => {
      const currentUser = context.getUser()

      if (!currentUser) {
        console.log(`Attempt logout without user account`)
        throw new Error(`Unable to find your account, please log in`)
      }

      context.logout()
      console.log(`User "${currentUser._id}" logged out`)
      return 'Successfully logged out'
    },
    signup: async (
      parent,
      { firstName, lastName, email, password, privacy },
      context,
    ) => {
      const userInfo = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: lastName.trim(),
        password,
        privacy,
      }
      console.log(
        `User trying to create new account with info: ${JSON.stringify(
          userInfo,
        )}`,
      )
      const existingUser = await (
        await context.db.query(
          aql`FOR user IN users FILTER user.email == ${email} RETURN user`,
        )
      ).next()

      if (existingUser) {
        console.log(
          `User with email "${
            userInfo.email
          }" already exists. User info: "${JSON.stringify(userInfo)}"`,
        )
        throw new Error(`Email already used`)
      }

      const hashedPassword = bcrypt.hashSync(password, 10)
      const userDetails = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        privacy,
      }

      let newUser
      try {
        console.log(
          `Attempting to insert new user with info: "${JSON.stringify(
            userInfo,
          )}"`,
        )
        newUser = await (
          await context.db.query(
            aql`INSERT ${userDetails} INTO users LET inserted = NEW RETURN inserted`,
          )
        ).next()
      } catch (error) {
        console.log(
          `Error when creating user with info "${userInfo}": ${error}`,
        )
        throw new Error(error)
      }

      console.log(`New user created: ${JSON.stringify(newUser)}`)

      await context.login(newUser)
      return { user: newUser }
    },
  },
}
