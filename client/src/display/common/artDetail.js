import React from 'react'
import { Container ,Image,Button} from 'semantic-ui-react'

const ContainerExampleContainer = (props) => {

    let {selectArt,voteAction,hidePS}=props
    let {title,
        author,
        icon,
        des,
        info,
        prise,
        step,
        balance,
        value}=selectArt
    return (
        <Container>
            <p>
                <Image  src={icon} size='small'/>
                {title} &nbsp;&nbsp;&nbsp;文章合约地址：{value}<br></br>
                作者：{author}&nbsp;&nbsp;&nbsp;文章收益：{balance}<br></br>
                点赞数：{prise}&nbsp;&nbsp;&nbsp;踩数：{step}<br></br>
                简介：{des}<br></br>
                    {info}<br></br>
                {hidePS===false&&<Button onClick={()=>{voteAction(true)}}>赞</Button>}
                {hidePS===false&&<Button onClick={()=>{voteAction(false)}}>踩</Button>}
            </p>
        </Container>
    )
}

export default ContainerExampleContainer