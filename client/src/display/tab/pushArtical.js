import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import  contractFun  from '../../utils/getContract'
import ipfs from '../../utils/ipfsApi'
class FormExampleCaptureValues extends Component {
   
  state = { 
      title :'',
      author: '', 
      iconLink: '', 
      des:'',
      info:'',
      desLink: '', 
      infoLink: '',
      fileinfo:''
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  selectImage=(fileinfo)=>{
    // console.log(fileinfo)
    this.setState({
        fileinfo
    })
  }
  handleSubmit = () => { 
    const { title, author,des,info,fileinfo} = this.state
    // console.log(title, author,des,info)
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(fileinfo)

    reader.onload=async()=>{
        // console.log(reader.result)
        try {
            let iconLink = await ipfs.uploadData(reader.result)

            let desLink = await ipfs.uploadData(des)
     
            let infoLink = await ipfs.uploadData(info)
            
            let res=await contractFun.createArtical(title,author,iconLink,desLink,infoLink)
            console.log(res)
            alert("发布成功")
            this.setState({
                title :'',
                author: '', 
                iconLink: '', 
                desLink: '', 
                infoLink: '',
                fileinfo:'',
                des:'',
                info:''
            })
        } catch (error) {
            console.log(error)
        }
    }
   
  }

  render() {
    const { title, author,des,info} = this.state

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
            <Form.Input placeholder='标题' name='title' value={title} onChange={this.handleChange} />
            <Form.Input placeholder='作者' name='author' value={author} onChange={this.handleChange} />
            <Form.Input type='file'  name='icon' mutiple='mutiple' onChange={(e) => {
                 this.selectImage(e.target.files[0])
            }} />
            <Form.Input placeholder='描述' name='des' value={des} onChange={this.handleChange} />
            <Form.TextArea
                placeholder='文章内容'
                name='info'
                value={info}
                onChange={this.handleChange}
                />
            <Form.Button content='Submit'/>
        </Form>
      </div>
    )
  }
}

export default FormExampleCaptureValues