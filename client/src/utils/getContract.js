import ArticalStore from "../contracts/ArticalStore.json";
import Artical from "../contracts/Artical"
// import getWeb3 from "../utils/getWeb3";
import Web3 from 'web3'
let web3 = new  Web3()
web3.setProvider(window.web3.currentProvider);


let getArticalStoreContract =async()=>{
    try {
        // const web3 = await getWeb3()
        const netId = await web3.eth.net.getId()
        const deployNet = ArticalStore.networks[netId]
        const artStore = new web3.eth.Contract(
            ArticalStore.abi,
            deployNet&&deployNet.address,
        )
        // console.log(web3,netId,deployNet,artStore)
        return artStore
    } catch (error) {
        console.log(error)
    }
}
let getArticalDetails=(addrs)=>{
    let all = addrs.map((value,index)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                // const web3 = await getWeb3()
                const art = new web3.eth.Contract(
                    Artical.abi,
                    value,
                )
                let accounts = await web3.eth.getAccounts();

                let res =await art.methods.getInfo().call({
                    from:accounts[0]
                })
                let {0:title,
                    1:author,
                    2:iconLink,
                    3:desLink,
                    4:infoLink,
                    5:prise,
                    6:step,
                    7:balance,
                }=res

                resolve({
                    title,
                    author,
                    iconLink,
                    desLink,
                    infoLink,
                    prise,
                    step,
                    balance,
                    value
                })
            } catch (error) {
                reject(error)
            }
        })
    })
    let allresult = Promise.all(all)
    return allresult
}

let createArtical=(title,author,iconLink,desLink,infoLink)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            // console.log(title,author,iconLink,desLink,infoLink)
            let artstore = await getArticalStoreContract()
            // console.log(artstore)
            // const web3 = await getWeb3()

            let accounts = await web3.eth.getAccounts();
           
            let res = await artstore.methods.createArt(title,author,iconLink,desLink,infoLink).send({
                from:accounts[0],
                value:1000
            })
            console.log(res)
            resolve(res)
        } catch (error) {
            reject(error)
        }
    })
}


let getAllArtical =async()=>{
    try {
        let artstore = await getArticalStoreContract()
        // const web3 = await getWeb3()

        let accounts = await web3.eth.getAccounts();
       
        let res = await artstore.methods.getAll().call({
            from:accounts[0]
        })
        return getArticalDetails(res)

    } catch (error) {
        return null
    }
}
let getMyArtical =async()=>{
    try {
        let artstore = await getArticalStoreContract()
        // const web3 = await getWeb3()

        let accounts = await web3.eth.getAccounts();

        let res = await artstore.methods.getOwnArt().call({
            from:accounts[0]
        })
        return getArticalDetails(res)

    } catch (error) {
        return null
    }
}
let getMyVoteArtical =async(isPrise)=>{
    try {
        let artstore = await getArticalStoreContract()
        // const web3 = await getWeb3()

        let accounts = await web3.eth.getAccounts();

        let res = await artstore.methods.getMyVoted(isPrise).call({
            from:accounts[0]
        })
        return getArticalDetails(res)

    } catch (error) {
        return null
    }
}
let voteAction=(isPrise,addr)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const art = new web3.eth.Contract(
                Artical.abi,
                addr,
            )
            let accounts = await web3.eth.getAccounts();
            if (isPrise){
                let pcost = await art.methods.getPCost().call({
                    from:accounts[0]
                })
                console.log("pcost=",pcost)
                let res = await art.methods.vote(isPrise).send({
                    from:accounts[0],
                    value:pcost
                })
                resolve(res)
            }else{
                let res = await art.methods.vote(isPrise).send({
                    from:accounts[0],
                })
                resolve(res)
            }
    
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

let countHot=()=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let artStore= await getArticalStoreContract()
            let accounts = await web3.eth.getAccounts();

            let res=await artStore.methods.countHot().send({
                from:accounts[0]
            })
            resolve(res)
        } catch (error) {
            reject(error)
        }
    })
}

let contractFun ={
    createArtical,
    getAllArtical,
    getMyArtical,
    getMyVoteArtical,
    voteAction,
    countHot
}
export default contractFun