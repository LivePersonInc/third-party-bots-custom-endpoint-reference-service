import { EventMessageType } from "../controllers/requestBodies";
import { Actions, TTRTypes } from "../models/bots/responses/IActionResponse";
import { IResponseType } from "../models/bots/responses/IResponseTypes";
import { IEventContext } from "../models/events/IEventContext";
import { IEventResponse } from "../models/events/IEventResponse";
import { MessageAudience } from "../models/events/ILPEvent";

export class ResponseFetcher {
  private static instance: ResponseFetcher;

  public static getInstance(): ResponseFetcher {
    if (!ResponseFetcher.instance) {
      ResponseFetcher.instance = new ResponseFetcher();
    }
    return ResponseFetcher.instance;
  }

  private getTransferAction(): IEventResponse {
    return {
      response: [
        {
          type: IResponseType.TEXT,
          data: {
            message: `I am sorry i couldn't help you. I will transfer you`
          }
        },
        {
          type: IResponseType.ACTION,
          data: {
            name: Actions.TRANSFER,
            parameters: {
              skillName: "dialogflowcx_messaging" // this is case sensitive
            }
          }
        }
      ],
      analytics: {
        intents: [
          {
            id: "base-transfer",
            description: "Custom Transfer",
            confidenceScore: 1
          }
        ]
      }
    };
  }

  private getCloseAction(): IEventResponse {
    return {
      response: [
        {
          type: IResponseType.TEXT,
          data: {
            message: "Ok see you later"
          }
        },
        {
          type: IResponseType.ACTION,
          data: {
            name: Actions.CLOSE_CONVERSATION,
            parameters: {}
          }
        }
      ],
      analytics: {
        intents: [
          {
            id: "base-bye",
            description: "Generic Bye Intent",
            confidenceScore: 0.95
          }
        ]
      }
    };
  }

  private getInvokeFunctionAction(): IEventResponse {
    return {
      response: [
        {
          type: IResponseType.TEXT,
          data: {
            message: "I will invoke a function"
          }
        },
        {
          type: IResponseType.ACTION,
          data: {
            name: Actions.INVOKE_FUNCTION,
            parameters: {
              lambdaUuid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // TODO: This needs to be changed to the FaaS Lambda UUID: https://developers.liveperson.com/liveperson-functions-foundations-external-invocation.html#function-uuid
              payload: { message: "I am example invocation function payload" } // This is example payload that can be changed as per the requirement of lambda
            }
          }
        }
      ],
      analytics: {
        intents: [
          {
            id: "base-invoke",
            description: "Generic Bye Intent",
            confidenceScore: 0.95
          }
        ]
      }
    };
  }

  private getChangeTTRAction(): IEventResponse {
    return {
      response: [
        {
          type: IResponseType.ACTION,
          data: {
            name: Actions.CHANGE_TTR,
            parameters: {
              ttrType: TTRTypes.URGENT
            }
          }
        }
      ],
      analytics: {
        intents: [
          {
            id: "change-ttr",
            description: "Wants to change the ttr",
            confidenceScore: 0.9
          }
        ]
      }
    };
  }

  private getStructuredContentResponse(): IEventResponse {
    return {
      response: [
        {
          type: IResponseType.STRUCTURED_CONTENT,
          data: {
            metadata: [
              {
                type: "ExternalId",
                id: "ABCD1234"
              }
            ],
            structuredContent: {
              type: "vertical",
              elements: [
                {
                  type: "button",
                  click: {
                    actions: [
                      {
                        text: "Encoded Metadata SC",
                        type: "publishText"
                      }
                    ]
                  },
                  title: "Recommend Me a Movie!"
                }
              ]
            }
          }
        }
      ],
      analytics: {
        intents: [
          {
            id: "base-sc",
            description: "SC Messages",
            confidenceScore: 1
          }
        ]
      }
    };
  }

  private getDelayResponse(): IEventResponse {
    return {
      response: [
        {
          type: IResponseType.TEXT,
          data: {
            message: `Pre Delay Text`
          }
        },
        {
          type: IResponseType.DELAY,
          data: {
            seconds: 4,
            typing: true
          }
        },
        {
          type: IResponseType.TEXT,
          data: {
            message: `Post Delay Text`
          }
        }
      ],
      analytics: {
        intents: [
          {
            id: "base-delay",
            description: "Delay Message",
            confidenceScore: 0.9
          }
        ]
      }
    };
  }

  private getQuickRepliesResponse(): IEventResponse {
    return {
      response: [
        {
          type: IResponseType.STRUCTURED_CONTENT,
          data: {
            structuredContent: {
              quickReplies: {
                type: "quickReplies",
                itemsPerRow: 8,
                replies: [
                  {
                    type: "button",
                    tooltip: "yes i do",
                    title: "yes",
                    click: {
                      actions: [
                        {
                          type: "publishText",
                          text: "yep"
                        }
                      ],
                      metadata: [
                        {
                          type: "ExternalId",
                          id: "Yes-1234"
                        }
                      ]
                    }
                  },
                  {
                    type: "button",
                    tooltip: "No!",
                    title: "No!",
                    click: {
                      actions: [
                        {
                          type: "publishText",
                          text: "No!"
                        }
                      ],
                      metadata: [
                        {
                          type: "ExternalId",
                          id: "No-4321"
                        }
                      ]
                    }
                  }
                ]
              },
              message: "Do you like Bots?"
            },
            metadata: [
              {
                id: "1234",
                type: "ExternalId"
              }
            ]
          }
        }
      ],
      analytics: {
        intents: [
          {
            id: "base-qr",
            description: "QR Messages",
            confidenceScore: 1
          }
        ]
      }
    };
  }

  private getPrivateTextResponse(): IEventResponse {
    return {
      response: [
        {
          type: IResponseType.TEXT,
          data: {
            message: `This is a normal Text`
          }
        },
        {
          type: IResponseType.TEXT,
          data: {
            message: `This is the hidden text from customer only visible to agent and manager`,
            messageAudience: MessageAudience.AGENTS_AND_MANAGERS
          }
        }
      ],
      analytics: {
        intents: [
          {
            id: "base-private",
            description: "private Message",
            confidenceScore: 0.9
          }
        ]
      }
    };
  }

  private getRichContentEventResponse(data: object): IEventResponse {
    return {
      response: [
        {
          type: IResponseType.TEXT,
          data: {
            message: `Found Rich Content Event following is the dump of all data`
          }
        },
        {
          type: IResponseType.TEXT,
          data: {
            message: `${JSON.stringify(data)}`
          }
        }
      ],
      analytics: {
        intents: [
          {
            id: "base-rich-content-event",
            description: "Custom Rich Content Event",
            confidenceScore: 1
          }
        ]
      }
    };
  }

  private getFallbackResponse(): IEventResponse {
    return {
      response: [
        {
          type: IResponseType.TEXT,
          data: {
            message: `I am sorry i don't understand can you repeat?`
          }
        }
      ],
      analytics: {
        intents: [
          {
            id: "base-fallback",
            description: "fallback Message",
            confidenceScore: 0.9
          }
        ]
      }
    };
  }

  private getSurveyStartResponse(requestData: object): IEventResponse {
    return {
      response: [
        {
          type: IResponseType.TEXT,
          data: {
            message: `Welcome to start of survey`
          }
        },
        {
          type: IResponseType.TEXT,
          data: {
            message: `${JSON.stringify(requestData)}`
          }
        }
      ],
      analytics: {
        intents: [
          {
            id: "survey-start",
            description: "Start Survey Event",
            confidenceScore: 0.9
          }
        ]
      }
    };
  }

  private getSurveyCloseResponse(requestData: object): IEventResponse {
    return {
      response: [
        {
          type: IResponseType.TEXT,
          data: {
            message: `This is the end of survey with following data`
          }
        },
        {
          type: IResponseType.TEXT,
          data: {
            message: `${JSON.stringify(requestData)}`
          }
        }
      ],
      analytics: {
        intents: [
          {
            id: "survey-end",
            description: "Survey End Event",
            confidenceScore: 0.9
          }
        ]
      }
    };
  }

  public getConsumerTextResponse(customerMessage: string): IEventResponse {
    switch (customerMessage) {
      case "escalate":
      case "transfer":
      case "i want to talk to human":
      case "i want to speak to a human":
        return this.getTransferAction();
      case "bye":
      case "close":
      case "close conversation":
      case "goodbye":
        return this.getCloseAction();
      case "faas":
      case "invoke function":
      case "invoke":
      case "function call":
        return this.getInvokeFunctionAction();
      case "urgent help":
      case "urgent":
      case "need help now":
      case "need help":
        return this.getChangeTTRAction();
      case "structured content":
      case "sc":
      case "rich content":
        return this.getStructuredContentResponse();
      case "delay":
      case "send delay":
      case "delay response":
        return this.getDelayResponse();
      case "quick replies":
      case "qr":
      case "quick replies example":
        return this.getQuickRepliesResponse(); // INFO: Only Works for Messaging Bots
      case "private text":
      case "pvt text":
      case "private text example":
        return this.getPrivateTextResponse();
      default:
        return this.getFallbackResponse();
    }
  }

  public getConsumerRichContentEventResponse(data: object): IEventResponse {
    return this.getRichContentEventResponse(data); // INFO: Only Works for Messaging Bots
  }


  public getWelcomeResponse(context: IEventContext): IEventResponse {
    const { lpEvent: { lastConsumerMessage } } = context;
    const message = lastConsumerMessage
      ? `I received the last consumer message: ${lastConsumerMessage}`
      : "Hello there! how can I help you today"
    return {
      response: [
        {
          type: IResponseType.TEXT,
          data: {
            message
          }
        }
      ],
      analytics: {
        intents: [
          {
            id: "welcome-intent",
            description: "welcome Message",
            confidenceScore: 0.9
          }
        ]
      }
    };
  }

  public getSurveyResponse(
    type: EventMessageType,
    customerMessage: object
  ): IEventResponse {
    switch (type) {
      case "START":
        return this.getSurveyStartResponse(customerMessage);
      case "CLOSE_CONVERSATION":
        return this.getSurveyCloseResponse(customerMessage);
      default:
        return this.getFallbackResponse();
    }
  }
}

export default ResponseFetcher.getInstance();
