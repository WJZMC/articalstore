pragma solidity ^0.5.0;
contract ArticalStore{
    address manager;

    uint256 createArtPay = 1000;//发布文章收取作者费用
    uint256 priseCost = 10;//点赞花费
    uint256 hotReward = 1000;//热门奖励金额
    uint256 hotCount = 20;//热门文章数量 默认20篇

    // constructor(uint256 _priseCost,uint256 _hotReward,uint256 _createArtPay,uint256 _hotCount) public{
    //     manager = msg.sender;
    //     priseCost = _priseCost;
    //     hotReward = _hotReward;
    //     createArtPay = _createArtPay;
    //     hotCount = _hotCount;
    // }
    constructor() public{
        manager = msg.sender;
    }

    address[] all;//所有文章合约地址
    mapping(address=>address[]) own2art;//我发表的
    PSRelation rel;//点赞踩过的合约对象

    //上一次热门评选之后发表的文章，才能参与新的热门评选
    //每评选一次热门就清空一次
    address[] preHot;//待评选热门文章

    function createArt(
        string memory _title,
        string memory _author,
        string memory _iconLink,
        string memory _desLink,
        string memory _infoLink
    ) public payable{
        require(bytes(_title).length>0);
        require(bytes(_author).length>0);
        require(bytes(_infoLink).length>0);
        require(msg.value==createArtPay);
        rel = new PSRelation();

        Artical art = new Artical(_title,_author,_iconLink,_desLink,_infoLink,priseCost,msg.sender,rel);
        all.push(address(art));
        own2art[msg.sender].push(address(art));
        createdMap[msg.sender]=true;

        preHot.push(address(art));
    }

    function getAll() public view returns(address[] memory){
        return all;
    }

    function getOwnArt()public view returns(address[]memory){
        return own2art[msg.sender];
    }

    function getMyVoted(bool isPrise) public view returns(address[] memory){
        if (isPrise){
            return rel.getPrise(msg.sender);
        }else{
            return rel.getStep(msg.sender);
        }
    }

    mapping(address=>bool) hoted;//上过热门
    //修改热门奖励金额的请求
    struct RCQuest{
        string des;
        uint256 aimMoney;
        uint256 voteC;
        bool isComplate;
    }
    RCQuest[] RCQArr;
    mapping(address=>bool) votedMap;//已参与投票
    mapping(address=>bool) createdMap;//记录是否发布过文章，只有发不过文章的人才能参与奖励变更投票

    function requestRC(string memory _des,uint256 _aimMoney)public onlyManager{
        RCQuest memory rq = RCQuest(
            _des,
            _aimMoney,
            0,
            false
        );
        RCQArr.push(rq);
    }

    function votdRC(uint256 _index)public{
        require(votedMap[msg.sender]==false);
        require(createdMap[msg.sender]==true);
        require(_index<RCQArr.length);
        RCQuest storage rq = RCQArr[_index];
        rq.voteC++;
        if(rq.voteC*2>RCQArr.length){
            hotReward = rq.aimMoney;
        }
    }
    //统计（赞-踩）前20篇
    function countHot() public payable onlyManager{
        address[] memory tmp = preHot;
        // for (uint256 i = 0;i<preHot.length;i++){
        //     address pre = preHot[i];
        //     tmp.push(pre);
        // }
        delete preHot;


        uint256 realCount;
        if (hotCount>tmp.length){
            realCount = tmp.length;
        }else{
            realCount = hotCount;
        }
        //修饰为memory的可变数组不能push
        address[] memory hot = new address[](realCount);

        for (uint256 i = 0;i<realCount;i++){
            Artical maxPrise = Artical(tmp[i]);
            for (uint256 j = i+1;j<tmp.length;j++){
                Artical art = Artical(tmp[j]);
                if (art.getVoteSub()>maxPrise.getVoteSub()){
                    Artical artTmp = maxPrise;
                    tmp[i] = address(art);
                    tmp[j] = address(artTmp);
                }
            }
            hot[i] = address(maxPrise);
        }
        //发放奖励  奖金池hotReward 的一定比例
        //第1名          20%          20 
        //第2,3，4，5名  10%*4         40
        //第6~10名       6%*5         30
        //11~20名       1%10          10
        for (uint256 i = 0;i<hot.length;i++){
            address tmphot = hot[i];
            uint256 money;
            if (i==0){
                money = hotReward/5;
            }else if(i>=1&&i<5){
                money = hotReward/10;
            }else if(i>=5&&i<10){
                money = hotReward/6;
            }else{
                money = hotReward/100;
            }
            Artical artical = Artical(tmphot);
            artical.pay.value(money)(money/5);
        }

    }

    //平台提现
    function cashCheck(uint256 _money) public payable onlyManager{
        require(_money>0);
        require(manager==msg.sender);
        require(_money<getBalance());
        msg.sender.transfer(_money);
    }
    function getBalance() private view returns(uint256){
        return address(this).balance;
    }
    modifier onlyManager{
        require(msg.sender==manager);
        _;
    }
    
}
//赞 踩关系
contract PSRelation{
    //点赞人=> 点赞过的文章
    mapping(address=>address[]) prise;
    mapping(address=>address[]) step;

    function addPrise(address _artAddr,address _user)public{
        prise[_user].push(_artAddr);
    }

    function getPrise(address _user)public view returns(address[] memory){
        return prise[_user];
    }

    function addStep(address _artAddr,address _user)public{
        step[_user].push(_artAddr);
    }

    function getStep(address _user)public view returns(address[] memory){
        return step[_user];
    }
}
//文章合约
contract Artical{

    address manager;//管理员地址
    PSRelation rel;//引入赞和踩的仓库

    string title;
    string author;
    string iconLink;//封面个
    string desLink;//描述
    string infoLink;//文章详情
    
    uint256 pCost;//赞花费

    address[] prise;//赞成人数组
    mapping(address=>bool) isCanReward;//是否可以领取热门奖励
    mapping(address=>bool) isReward;//是否领取过热门奖励
    uint256 rewardMoney;
    address[] step;//踩

    mapping(address=>bool) isDo;//是否操作

    constructor(
        string memory _title,
        string memory _author,
        string memory _iconLink,
        string memory _desLink,
        string memory _infoLink,
        uint256 _pCost,
        address _manager,
        PSRelation _rel
        ) 
        public{
        title = _title;
        author = _author;
        iconLink = _iconLink;
        desLink = _desLink;
        infoLink = _infoLink;
        pCost = _pCost;
        manager = _manager;
        rel = _rel;
    }
    
    function pay(uint256 _payReward) public payable{
        //奖励的20%平分给点赞者
        rewardMoney = _payReward/prise.length;
        for (uint256 j = 0;j<prise.length;j++){
            address othersTmp = prise[j];
            isCanReward[othersTmp]=true;
        }
        
    }
    
    function getReward() public payable{
        require(isCanReward[msg.sender]);
        require(isReward[msg.sender]);
        msg.sender.transfer(rewardMoney);
        isReward[msg.sender]=true;
    }
    
    function getPrise() public view returns(address[]memory){
        return prise;
    }
    function getPCost() public view returns(uint256){
        return pCost;
    }

    function vote(bool _prise)public payable{
        require( msg.sender != address(0));
        require( manager != msg.sender );
        require( isDo[msg.sender] == false);
        if (_prise == true){
            require(msg.value==pCost);
            prise.push(msg.sender);
            rel.addPrise(address(this),msg.sender);
        }else{
            step.push(msg.sender);
            rel.addStep(address(this),msg.sender);

        }
        isDo[msg.sender] = true;
    } 
    function getVoteSub()public view returns(uint256){
        if (prise.length>step.length){
            return prise.length-step.length;
        }else{
            return 0;
        }
    }

    function cashCheck(uint256 _money) public payable onlyManager{
        require(_money>0);
        require(_money<getBalance());
        msg.sender.transfer(_money);
    }

    function getInfo() public view returns( 
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        uint256 ,
        uint256 ,
        uint256
         ){
        return(
            title,
            author,
            iconLink,
            desLink,
            infoLink,
            prise.length,
            step.length,
            getBalance()
        );
    }
    function getBalance() private view returns(uint256){
        return address(this).balance;
    }


    modifier onlyManager{
        require(msg.sender==manager);
        _;
    }

}