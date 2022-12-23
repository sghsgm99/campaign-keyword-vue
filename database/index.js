import { Database } from '@vuex-orm/core'
import Users from '@/models/Users'
import Accounts from '@/models/Accounts'
import Channels from '@/models/Channels'
import Sites from '@/models/Sites'
import SitesListOptions from '@/models/SiteListOptions'
import SiteCategories from '@/models/SiteCategories'
import SiteTags from '@/models/SiteTags'
import Campaigns from '@/models/Campaigns'
import Articles from '@/models/Articles'
import Analytics from '@/models/Analytics'
import Settings from '@/models/Settings'
import AdTemplates from '@/models/AdTemplates'
import Reports from '@/models/Reports'
import CManagers from '@/models/CManagers'
import AdPartners from '@/models/AdPartners'
import SiteAds from '@/models/SiteAds'
import AdBuilders from '@/models/AdBuilders'
import BlackLists from '@/models/BlackLists'
import RuleSets from '@/models/RuleSets'
import KeywordSpinning from '@/models/KeywordSpinning'
import Domains from '@/models/Domains'
import SubDomains from '@/models/SubDomains'
import Collections from '@/models/Collections'
import CollectionAds from '@/models/CollectionAds'
import AdLibrary from '@/models/AdLibrary'

const database = new Database()

database.register(Users)
database.register(Accounts)
database.register(Channels)
database.register(Sites)
database.register(Campaigns)
database.register(Articles)
database.register(Analytics)
database.register(Settings)
database.register(Articles)
database.register(SitesListOptions)
database.register(SiteCategories)
database.register(SiteTags)
database.register(AdTemplates)
database.register(Reports)
database.register(CManagers)
database.register(AdPartners)
database.register(SiteAds)
database.register(AdBuilders)
database.register(BlackLists)
database.register(RuleSets)
database.register(KeywordSpinning)
database.register(Domains)
database.register(SubDomains)
database.register(Collections)
database.register(CollectionAds)
database.register(AdLibrary)

export default database