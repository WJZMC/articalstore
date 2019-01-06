
import React from 'react'
import ListExampleImage from '../common/sublist'
import contractFun from '../../utils/getContract'
import ipfs from '../../utils/ipfsApi';
import ContainerExampleContainer from '../common/artDetail'

class MyVoteArtical extends React.Component{

    state={
        all:[],
        selectArt:null,
    }
    componentDidMount=async ()=>{
        let tmp = await contractFun.getMyVoteArtical(true)
        let all = await ipfs.getRealData(tmp)
        this.setState({
            all
        })
    }



    clickArt=(selectArt)=>{
        this.setState({
            selectArt
        })
    }

    render(){
        let {all,selectArt}=this.state
        return(
            <div>
                <ListExampleImage all={all} clickArt={this.clickArt}/>
                <br></br><br></br>
                {selectArt&&<ContainerExampleContainer selectArt={selectArt} hidePS={true}/>}

            </div>
        )
    }
}

export default MyVoteArtical