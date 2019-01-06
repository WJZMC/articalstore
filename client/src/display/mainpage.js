import React from 'react'
import { Tab } from 'semantic-ui-react'
import FormExampleCaptureValues from './tab/pushArtical'
import AllArtical from './tab/allArtical'
import  MyArtical  from './tab/myArtical'
import  MyVoteArtical  from './tab/myPriseArtical'

const panes = [
  { menuItem: '所有文章', render: () => <Tab.Pane attached={false}><AllArtical/></Tab.Pane> },
  { menuItem: '我的文章', render: () => <Tab.Pane attached={false}><MyArtical/></Tab.Pane> },
  { menuItem: '我点赞的文章', render: () => <Tab.Pane attached={false}><MyVoteArtical/></Tab.Pane> },
  { menuItem: '发布文章', render: () => <Tab.Pane attached={false}><FormExampleCaptureValues/></Tab.Pane> },
]

const TabExampleText = () => <Tab menu={{ text: true }} panes={panes} />

export default TabExampleText