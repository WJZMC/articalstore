
import React from 'react'
import ListExampleImage from '../common/sublist'
import contractFun from '../../utils/getContract'
import ipfs from '../../utils/ipfsApi';
import ContainerExampleContainer from '../common/artDetail'

class AllArtical extends React.Component{

    state={
        all:[],
        selectArt:null,
    }
    componentDidMount=async ()=>{
        let tmp = await contractFun.getAllArtical()
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

    voteAction=async(isprise)=>{
        if (isprise){
            console.log("prise")
        }else{
            console.log("step")
        }
        try {
            let {selectArt}=this.state
            let {value}=selectArt
            let res =await contractFun.voteAction(isprise,value)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    render(){
        let {all,selectArt}=this.state
        return(
            <div>
                <ListExampleImage all={all} clickArt={this.clickArt}/>
                <br></br><br></br>
                {selectArt&&<ContainerExampleContainer selectArt={selectArt} voteAction={this.voteAction}/>}

            </div>
        )
    }
}

export default AllArtical