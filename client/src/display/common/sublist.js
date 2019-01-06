import React from 'react'
import { List, Image } from 'semantic-ui-react'

const ListExampleImage = (props) => {
  let {all,clickArt}=props
  let list=""
  if (all){
     list= all.map((value,index)=>{
      let {title,author,icon,des,info}=value
       return (
        <List.Item key={index} onClick={()=>{
          clickArt(value)
        }}>
        <Image  src={icon} size='small'/>
        <List.Content>
          <List.Header as='a'>{title}  
          </List.Header>
          <List.Description>
           作者：{author}<br></br>
           简介：{des}<br></br>
          </List.Description>
        </List.Content>
      </List.Item>
       )
    })
  }
  return(
    <List>{list}
    </List>
  )
}

export default ListExampleImage