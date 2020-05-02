pragma solidity >=0.4.22 <0.7.0;






contract CampaignFactory{

    address[] deployedCampaigns;


    function createCampaign(uint minimum) public{
        address managerAddress= msg.sender;
        Campaign newCampaign = new Campaign(minimum,managerAddress);

        deployedCampaigns.push(address(newCampaign));

    }

    function getDeployedCampaigns() public view returns(address[] memory){
        return deployedCampaigns;
    }

}






contract Campaign{

    struct Request{
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }


    Request[] public requests;
    address public manager;

    uint public minimumContribution;
    mapping(address => bool) public backers;
    uint public backersCount;


    //modifier function


    modifier restricted(){
        require(msg.sender==manager);
        _;
    }

    constructor(uint minimum, address managerAddress) public {
        // older versions used do have a constructor named as a function with the same name of the contract.
        manager=managerAddress;

        //require(minimum > 0.25 ether);
        minimumContribution=minimum;

    }

    function contribute() public payable{
        require(msg.value>minimumContribution);
        //require(msg.value > 0.05 ether);

        backers[msg.sender] = true;
        backersCount++;

    }

    // function numberOfApprovers() public view returns(uint){
    //     return approvers.length;
    //

    function createRequest(string memory description, uint value, address payable recipient)
        public restricted{
            Request memory newRequest = Request({
                description:description,
                value:value,
                recipient:recipient,
                complete:false,
                approvalCount:0
            });
            requests.push(newRequest);

    }

    function aproveRequest(uint index) public  {
        Request storage request = requests[index];

        require(backers[msg.sender]);
        require(!request.approvals[msg.sender]); //if this person has voted on this request he is not allowed to vote again.
        request.approvalCount++;
        request.approvals[msg.sender]=true;
    }

    function finalizeRequest(uint index) payable public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(address(this).balance > request.value) ;
        require(request.approvalCount > (backersCount/2) );

        request.recipient.transfer(request.value);
        request.complete=true;



    }




}
