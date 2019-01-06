let ipfsClient = require('ipfs-api')

let oipfs = ipfsClient('localhost','5001',{protocol:'http'})
let uploadData=(data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let content = oipfs.types.Buffer.from(data)
            let res = await oipfs.files.add(content)
            resolve(res[0].hash)
        } catch (error) {
            reject(error)
        }
    })
}
let getRealData=(data)=>{
   if (data){
    let all = data.map((art,index)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                let {title,
                    author,
                    iconLink,
                    desLink,
                    infoLink,
                    prise,
                    step,
                    balance,
                    value}=art
                let icon = getRealImageURl(iconLink)
                let des = await getRealTextData(desLink)
                let info = await getRealTextData(infoLink)
                let result={
                    title,
                    author,
                    icon,
                    des,
                    info,
                    prise,
                    step,
                    balance,
                    value
                }
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    })
    return Promise.all(all)
   }else{
       return null
   }
}
let getRealImageURl=(data)=>{
    return "http://localhost:8080/ipfs/"+data
}
let getRealTextData =async(data)=>{
    let descInfo = await oipfs.cat(data)
    console.log('descInfo:', descInfo.toString())
    return descInfo.toString()
}

let ipfs ={
    uploadData,
    getRealData,
}

export default ipfs;


// let ipfsClient = require('ipfs-api')

// var ipfs = ipfsClient('localhost', '5001', {protocol: 'http'})


// let ipfsTest = async () => {

//     console.log('++++++++++++ add 命令 +++++++++++')
//     let content = ipfs.types.Buffer.from('ABC');

//     //buffer类型
//     let results = await ipfs.files.add(content);
//     let hash = results[0].hash; // "Qm...WW"

//     console.table(results)
//     console.table(hash)

//     console.log('++++++++++++ cat 命令 +++++++++++')
//     let info = await ipfs.cat(hash)
//     console.log('info :', info.toString())

//     console.log('++++++++++++ ls 命令 ++++++++++++')

//     let resArray = await ipfs.ls('QmcvT7PF1U91XFawybHwrayxievfRRmAitM2ZdkWUJs4st')

//     resArray.forEach(res => {
//         // console.table(res.name)
//         console.table(res)
//     })
// }

// ipfsTest()