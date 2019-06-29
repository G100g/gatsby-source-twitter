"use strict";

const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList
} = require(`gatsby/graphql`);

const IndiceType = new GraphQLList(GraphQLInt);
const AspectRatioType = new GraphQLList(GraphQLInt);
const CoordinatesType = new GraphQLList(GraphQLFloat);
const EntityType = new GraphQLObjectType({
  name: `Entity`,
  fields: {
    text: {
      type: GraphQLString
    },
    indices: {
      type: IndiceType
    }
  }
});
const UserMentionType = new GraphQLObjectType({
  name: `UserMention`,
  fields: {
    screen_name: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    id: {
      type: GraphQLFloat
    },
    id_str: {
      type: GraphQLString
    },
    indices: {
      type: IndiceType
    }
  }
});
const UrlType = new GraphQLObjectType({
  name: `Url`,
  fields: {
    url: {
      type: GraphQLString
    },
    expanded_url: {
      type: GraphQLString
    },
    display_url: {
      type: GraphQLString
    },
    indices: {
      type: IndiceType
    }
  }
});
const TweetMediaSizeType = new GraphQLObjectType({
  name: `TweetMediaSize`,
  fields: {
    w: {
      type: GraphQLInt
    },
    h: {
      type: GraphQLInt
    },
    resize: {
      type: GraphQLString
    }
  }
});
const VariantType = new GraphQLObjectType({
  name: `TweetVideoInfoVariant`,
  fields: {
    bitrate: {
      type: GraphQLInt
    },
    content_type: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    }
  }
});
const VideoInfoType = new GraphQLObjectType({
  name: `TweetVideoInfo`,
  fields: {
    aspect_ratio: {
      type: AspectRatioType
    },
    duration_millis: {
      type: GraphQLInt
    },
    // aspect_ratio: { type: AspectRatioType },
    variants: {
      type: new GraphQLList(VariantType)
    }
  }
});
const TweetExtendedEntitiesMediaType = new GraphQLObjectType({
  name: `TweetExtendedEntitiesMedia`,
  fields: {
    id: {
      type: GraphQLFloat
    },
    id_str: {
      type: GraphQLString
    },
    indices: {
      type: IndiceType
    },
    media_url: {
      type: GraphQLString
    },
    media_url_https: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    },
    display_url: {
      type: GraphQLString
    },
    expanded_url: {
      type: GraphQLString
    },
    type: {
      type: GraphQLString
    },
    sizes: {
      type: new GraphQLObjectType({
        name: `TweetMediaSizes`,
        fields: {
          thumb: {
            type: TweetMediaSizeType
          },
          small: {
            type: TweetMediaSizeType
          },
          medium: {
            type: TweetMediaSizeType
          },
          large: {
            type: TweetMediaSizeType
          }
        }
      })
    },
    video_info: {
      type: VideoInfoType
    },
    additional_media_info: {
      type: new GraphQLObjectType({
        name: `AdditionalMediaInfo`,
        fields: {
          monetizable: {
            type: GraphQLBoolean
          }
        }
      })
    }
  }
});
const EntitiesType = new GraphQLObjectType({
  name: `TweetEntities`,
  fields: {
    media: {
      type: new GraphQLList(TweetExtendedEntitiesMediaType)
    },
    hashtags: {
      type: new GraphQLList(EntityType)
    },
    symbols: {
      type: new GraphQLList(EntityType)
    },
    user_mentions: {
      type: new GraphQLList(UserMentionType)
    },
    urls: {
      type: new GraphQLList(UrlType)
    }
  }
});
const UserEntityUrlType = new GraphQLObjectType({
  name: `UserEntityUrlType`,
  fields: {
    urls: {
      type: new GraphQLList(UrlType)
    }
  }
});
const UserEntitiesType = new GraphQLObjectType({
  name: `UserEntities`,
  fields: {
    url: {
      type: UserEntityUrlType
    },
    description: {
      type: UserEntityUrlType
    }
  }
});
const UserType = new GraphQLObjectType({
  name: `TwitterUser`,
  fields: {
    id: {
      type: GraphQLFloat
    },
    id_str: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    screen_name: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    },
    entities: {
      type: UserEntitiesType
    },
    protected: {
      type: GraphQLBoolean
    },
    followers_count: {
      type: GraphQLInt
    },
    friends_count: {
      type: GraphQLInt
    },
    listed_count: {
      type: GraphQLInt
    },
    created_at: {
      type: GraphQLString
    },
    favourites_count: {
      type: GraphQLInt
    },
    utc_offset: {
      type: GraphQLInt
    },
    time_zone: {
      type: GraphQLString
    },
    geo_enabled: {
      type: GraphQLBoolean
    },
    verified: {
      type: GraphQLBoolean
    },
    statuses_count: {
      type: GraphQLInt
    },
    lang: {
      type: GraphQLString
    },
    contributors_enabled: {
      type: GraphQLBoolean
    },
    is_translator: {
      type: GraphQLBoolean
    },
    is_translation_enabled: {
      type: GraphQLBoolean
    },
    profile_background_color: {
      type: GraphQLString
    },
    profile_background_image_url: {
      type: GraphQLString
    },
    profile_background_image_url_https: {
      type: GraphQLString
    },
    profile_background_tile: {
      type: GraphQLBoolean
    },
    profile_image_url: {
      type: GraphQLString
    },
    profile_image_url_https: {
      type: GraphQLString
    },
    profile_banner_url: {
      type: GraphQLString
    },
    profile_link_color: {
      type: GraphQLString
    },
    profile_sidebar_border_color: {
      type: GraphQLString
    },
    profile_sidebar_fill_color: {
      type: GraphQLString
    },
    profile_text_color: {
      type: GraphQLString
    },
    profile_use_background_image: {
      type: GraphQLBoolean
    },
    has_extended_profile: {
      type: GraphQLBoolean
    },
    default_profile: {
      type: GraphQLBoolean
    },
    default_profile_image: {
      type: GraphQLBoolean
    },
    // following: null,
    // follow_request_sent: null,
    // notifications: null,
    translator_type: {
      type: GraphQLString
    }
  }
});
const BoundingBoxType = new GraphQLObjectType({
  name: `BoundingBox`,
  fields: {
    type: {
      type: GraphQLString
    },
    coordinates: {
      type: new GraphQLList(new GraphQLList(CoordinatesType))
    }
  }
}); //     // [
//     //     [
//     //         [
//     //             2.2241006,
//     //             48.8155214
//     //         ],
//     //         [
//     //             2.4699053,
//     //             48.8155214
//     //         ],
//     //         [
//     //             2.4699053,
//     //             48.9021461
//     //         ],
//     //         [
//     //             2.2241006,
//     //             48.9021461
//     //         ]
//     //     ]
//     // ]
//   }

exports.twitterType = {
  // created_at: {
  //   type: GraphQLString
  // },
  text: {
    type: GraphQLString
  },
  full_text: {
    type: GraphQLString
  },
  // truncated: {
  //   type: GraphQLBoolean
  // },
  // id_str: {
  //   type: GraphQLString
  // },
  entities: {
    type: EntitiesType
  },
  // in_reply_to_user_id_str: {
  //   type: GraphQLString
  // },
  // contributors: {
  //   type: GraphQLString
  // },
  // display_text_range: {
  //   type: GraphQLString
  // },
  extended_entities: {
    type: new GraphQLObjectType({
      name: `TweetExtendedEntities`,
      fields: {
        media: {
          type: new GraphQLList(TweetExtendedEntitiesMediaType)
        }
      }
    })
  },
  // metadata: {
  //   type: GraphQLString
  // },
  // source: {
  //   type: GraphQLString
  // },
  // in_reply_to_status_id: {
  //   type: GraphQLString
  // },
  // in_reply_to_status_id_str: {
  //   type: GraphQLString
  // },
  // in_reply_to_user_id: {
  //   type: GraphQLString
  // },
  // in_reply_to_screen_name: {
  //   type: GraphQLString
  // },
  user: {
    type: UserType
  },
  // geo: {
  //   type: GraphQLString
  // },
  // coordinates: {
  //   type: GraphQLString
  // },
  place: {
    type: new GraphQLObjectType({
      name: `TweetPlace`,
      fields: {
        id: {
          type: GraphQLString
        },
        url: {
          type: GraphQLString
        },
        place_type: {
          type: GraphQLString
        },
        name: {
          type: GraphQLString
        },
        full_name: {
          type: GraphQLString
        },
        country_code: {
          type: GraphQLString
        },
        country: {
          type: GraphQLString
        } // contained_within: new GraphQLList(),
        // bounding_box: {
        //   type: BoundingBoxType
        // },
        // attributes: { type: new GraphQLObjectType({
        //   name: "TweetPlaceattributes",
        //   fields: {
        //     geotagCount: { type: GraphQLInt },
        //   }
        // })}

      }
    })
  } // is_quote_status: {
  //   type: GraphQLString
  // },
  // retweet_count: {
  //   type: GraphQLString
  // },
  // favorite_count: {
  //   type: GraphQLString
  // },
  // favorited: {
  //   type: GraphQLString
  // },
  // retweeted: {
  //   type: GraphQLString
  // },
  // possibly_sensitive: {
  //   type: GraphQLString
  // },
  // lang: {
  //   type: GraphQLString
  // }

};