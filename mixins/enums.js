import { ENUMS } from '~/enums'
export default {
  computed: {
    articleStatus() {
      return ENUMS.ArticleStatusEnum
    },
    articleType() {
      return ENUMS.ArticleTypeEnum
    },
    campaignStatus() {
      return ENUMS.CampaignStatusEnum
    },
    channelPlatform() {
      return ENUMS.ChannelPlatformEnum
    },
    channelStatus() {
      return ENUMS.ChannelStatusEnum
    },
    fbAdsetBidStrategy() {
      return ENUMS.FacebookAdSetBidStrategyEnum
    },
    fbAdsetBillingEvent() {
      return ENUMS.FacebookAdSetBillingEventEnum
    },
    fbAudienceNetworkPosition() {
      return ENUMS.FacebookAudienceNetworkPositionEnum
    },
    fbBudgetType() {
      return ENUMS.FacebookBudgetTypeEnum
    },
    fbCampaignBuyingType() {
      return ENUMS.FacebookCampaignBuyingTypeEnum
    },
    fbCampaignObjective() {
      return ENUMS.FacebookCampaignObjectiveEnum
    },
    fbCampaignSpecialAdCategory() {
      return ENUMS.FacebookCampaignSpecialAdCategoryEnum
    },
    fbCampaignStatus() {
      return ENUMS.FacebookCampaignStatusEnum
    },
    fbDevicePlatform() {
      return ENUMS.FacebookDevicePlatformEnum
    },
    fbEducationalStatus() {
      return ENUMS.FacebookEducationalStatusEnum
    },
    fbFacebookPosition() {
      return ENUMS.FacebookFacebookPositionEnum
    },
    fbGender() {
      return ENUMS.FacebookGenderEnum
    },
    fbInstagramPosition() {
      return ENUMS.FacebookInstagramPositionEnum
    },
    fbLocation() {
      return ENUMS.FacebookLocationTypeEnum
    },
    fbMessengerPosition() {
      return ENUMS.FacebookMessengerPositionEnum
    },
    fbPublisherPlatform() {
      return ENUMS.FacebookPublisherPlatformEnum
    },
    fbRelationshipStatus() {
      return ENUMS.FacebookRelationshipStatusEnum
    },
    genericStatus() {
      return ENUMS.GenericStatusEnum
    },
    pageType() {
      return ENUMS.PageTypeEnum
    },
    permissionType() {
      return ENUMS.PermissionTypeEnum
    },
    roleType() {
      return ENUMS.RoleTypeEnum
    },
    sitePlatform() {
      return ENUMS.SitePlatformEnum
    },
    siteStatus() {
      return ENUMS.SiteStatusEnum
    },
    userStatus() {
      return ENUMS.UserStatusEnum
    },
    storageDisk() {
      return ENUMS.StorageDiskEnum
    },
    wordpressPostStatus() {
      return ENUMS.WordpressPostStatusEnum
    },
    reportPlatform() {
      return ENUMS.ReportPlatformEnum
    },
    siteAdSource() {
      return ENUMS.SiteAdSourceEnum
    },
    siteAdPlatform() {
      return ENUMS.SiteAdPlatformEnum
    },
    siteAdDisclosure() {
      return ENUMS.SiteAdDisclosureEnum
    },
    siteAdBorder() {
      return ENUMS.SiteAdBorderEnum
    },
    siteAdOrganic() {
      return ENUMS.SiteAdOrganicEnum
    },
    facebookVerticalEnum() {
      return ENUMS.FacebookVerticalEnum
    },
    facebookTimezoneEnum() {
      return ENUMS.FacebookTimezoneEnum
    },
    yahooReportTypeEnum() {
      return ENUMS.YahooReportTypeEnum
    },
    blackListStatus() {
      return ENUMS.BlackListStatusEnum
    },
    blackListType() {
      return ENUMS.BlackListTypeEnum
    },
    ruleSetType() {
      return ENUMS.RuleSetTypeEnum
    },
    ruleSetSchedule() {
      return ENUMS.RuleSetScheduleEnum
    },
    ruleSetBtnSize() {
      return ENUMS.RuleSetBtnSizeEnum
    },
    ruleSetWeek() {
      return ENUMS.RuleSetWeekEnum
    },
    ruleSetBtnStyle() {
      return ENUMS.RuleSetBtnStyleEnum
    },
    facebookAudienceTypeEnum() {
      return ENUMS.FacebookAudienceTypeEnum
    },
    facebookPageEventFilterValueEnum() {
      return ENUMS.FacebookPageEventFilterValueEnum
    },
    facebookCallToActionEnum() {
      return ENUMS.FacebookCallToActionEnum
    },
    yahooDDCReportTypeEnum() {
      return ENUMS.YahooDDCReportTypeEnum
    },
    bingReportTypeEnum() {
      return ENUMS.BingReportTypeEnum
    },
    throguhOptionEnum() {
      return ENUMS.ThroguhOptionEnum
    },
    facebookCustomEventTypeEnum() {
      return ENUMS.FacebookCustomEventTypeEnum
    },
    campaignInAppStatusEnum() {
      return ENUMS.CampaignInAppStatusEnum
    },
    fbRuleActionEnum() {
      return ENUMS.FbRuleActionEnum
    },
    fbRuleConditionComparison() {
      return ENUMS.FbRuleConditionComparison
    },
    fbRuleConditionOperator() {
      return ENUMS.FbRuleConditionOperator
    },
    fbRuleConditionTarget() {
      return ENUMS.FbRuleConditionTarget
    },
    fbRuleTargetEnum() {
      return ENUMS.FbRuleTargetEnum
    },
    adCategoryEnum() {
      return ENUMS.AdCategoryEnum
    }
  },
  methods: {
    getValue(enumType, id) {
      let keyValue = null
      Object.entries(ENUMS[enumType]).forEach(([key, obj]) => {
        if (obj.value == id) {
          keyValue = obj.key
        }
      })
      return keyValue
    }
  }
}
