    // Sample responses to ctx

Context {
    update: {
      update_id: 792665088,
      message: {
        message_id: 8,
        from: [Object],
        chat: [Object],
        date: 1646573274,
        text: '/start',
        entities: [Array]
      }
    },
    tg: Telegram {
      token: '',
      response: undefined,
      options: {
        apiRoot: 'https://api.telegram.org',
        apiMode: 'bot',
        webhookReply: true,
        agent: [Agent],
        attachmentAgent: undefined
      }
    },
    botInfo: {
      id: 5138955779,
      is_bot: true,
      first_name: 'Badass Cookies',
      username: 'badasscookiesbot',
      can_join_groups: true,
      can_read_all_group_messages: false,
      supports_inline_queries: false
    },
    state: {},
    startPayload: ''
  }

  // Sample response of from
  {
    id: 1214229226,
    is_bot: false,
    first_name: 'Mayank',
    last_name: 'Sharma',
    username: 'meshoome',
    language_code: 'en'
  }
  // Sample response of chat
  {
    id: 1214229226,
    first_name: 'Mayank',
    last_name: 'Sharma',
    username: 'meshoome',
    type: 'private'
  }
  // Sample response of message
  {
    message_id: 10,
    from: {
      id: 1214229226,
      is_bot: false,
      first_name: 'Mayank',
      last_name: 'Sharma',
      username: 'meshoome',
      language_code: 'en'
    },
    chat: {
      id: 1214229226,
      first_name: 'Mayank',
      last_name: 'Sharma',
      username: 'meshoome',
      type: 'private'
    },
    date: 1646574252,
    text: '/start',
    entities: [ { offset: 0, length: 6, type: 'bot_command' } ]
  }

  // Sample response of update 
  {
    update_id: 792665093,
    message: {
      message_id: 17,
      from: {
        id: 1214229226,
        is_bot: false,
        first_name: 'Mayank',
        last_name: 'Sharma',
        username: 'meshoome',
        language_code: 'en'
      },
      chat: {
        id: 1214229226,
        first_name: 'Mayank',
        last_name: 'Sharma',
        username: 'meshoome',
        type: 'private'
      },
      date: 1646575659,
      text: '/start',
      entities: [ [Object] ]
    }
  } 