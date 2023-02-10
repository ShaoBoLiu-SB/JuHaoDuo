import Home from '@/pages/Home/Home.vue'
import Scripts from '@/pages/Scripts/Script.vue'
import About from '@/pages/About/About.vue'
import ScriptDetail from '@/pages/scriptDetail/scriptDetail'
import Mine from '@/pages/Mine/Mine'
import Setting from '@/pages/Setting/Setting'
import Author from '@/pages/Author/Author'
import BeAuthor from '@/pages/Author/children/BeAuthor'
import Audit from '@/pages/Author/children/Audit.vue'
import Editor from '@/pages/Editor/Editor.vue'
import Message from '@/pages/Message/Message.vue'
import Loging from '@/pages/Loging/Loging.vue'

// mine下面的二级子路由
import userMessage from '@/pages/Mine/children/UserMessage';
import Collection from '@/pages/Mine/children/Collection';
import History from '@/pages/Mine/children/History';
import Wallet from '@/pages/Mine/children/Wallet';
import Transaction from '@/pages/Mine/children/Transaction'

// setting下面的二级子路由
import BasicData from '@/pages/Setting/children/BasicData'
import AltAvatar from '@/pages/Setting/children/AltAvatar'
import AltPwd from '@/pages/Setting/children/AltPwd'
import AltPhone from '@/pages/Setting/children/AltPhone'
import MessagePolicy from '@/pages/Setting/children/MessagePolicy'

// 作者中心下面的二级子路由
import CreateCenter from '@/pages/Author/children/CreateCenter';
import WorksAdmain from '@/pages/Author/children/WorksAdmain';
import Income from '@/pages/Author/children/Income';
import DataAly from '@/pages/Author/children/DataAly'
import CreateNewScript from '@/pages/Author/children/CreateNewScript.vue'
import ChapterAdmain from '@/pages/Author/children/ChpaterAdmain.vue'

export const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    name: 'home'
  },
  {
    path: '/script',
    component: Scripts,
    name: 'script'
  },
  {
    path: '/about',
    component: About,
    name: 'about'
  },
  {
    path: '/author',
    component: Author,
    name: 'author',
    redirect: '/author/createcenter',
    children: [
      { path: 'createcenter', component: CreateCenter, name: 'createcenter' },
      { path: 'worksadmain', component: WorksAdmain, name: 'worksadmain' },
      { path: 'income', component: Income, name: 'income' },
      { path: 'dataaly', component: DataAly, name: 'dataaly' },
      { path: 'createnewscript', component: CreateNewScript, name: 'createnewscript' },
      { path: 'chapteradmain', component: ChapterAdmain, name: 'chapteradmain' }
    ]
  },
  {
    path: '/beauthor',
    component: BeAuthor,
    name: 'beauthor',
  },
  {
    path: '/audit',
    component: Audit,
    name: 'audit'
  },
  {
    path: '/scriptdetail',
    component: ScriptDetail,
    name: 'scriptdetail'
  },
  {
    path: '/mine',
    component: Mine,
    name: 'mine',
    redirect: '/mine/userMessage',
    children: [
      { path: 'usermessage', component: userMessage, name: 'usermessage' },
      { path: 'collection', component: Collection, name: 'collection' },
      { path: 'history', component: History, name: 'history' },
      { path: 'wallet', component: Wallet, name: 'wallet' },
      { path: 'transaction', component: Transaction, name: 'transaction' },
    ]
  },
  {
    path: '/setting',
    component: Setting,
    name: 'setting',
    redirect: '/setting/basicdata',
    children: [
      { path: 'basicdata', component: BasicData },
      { path: 'altavatar', component: AltAvatar },
      { path: 'altpwd', component: AltPwd },
      { path: 'altphone', component: AltPhone },
      { path: 'messagepolicy', component: MessagePolicy },
    ]
  },
  {
    path: '/editor',
    name: 'editor',
    component: Editor,
  },
  {
    path: '/message',
    name: 'message',
    component: Message,
  },
  {
    path: '/loging',
    name: 'loging',
    component: Loging
  }

]