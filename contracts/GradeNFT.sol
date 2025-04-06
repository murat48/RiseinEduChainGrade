// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract GradeNFT {
    uint256 public gradesystemsCounter;
    string public name = "GradeNFT";
    string public symbol = "CNFT";

    struct GradeSystem {
        string lesson;
        string student;
        string studentnumber;
        string grade;
        address teacher;
        uint256 issueDate;
    }
    mapping(uint256 => GradeSystem) public gradesystems;
    mapping(uint256 => address) public teacher;
    mapping(address => uint256[]) public gradesystemnote;

    event GradeSystemIssued(
        uint256 gradesystemId,
        address teacher,
        string lesson,
        string student,
        string studentnumber,
        string grade,
        uint256 issueDate
    );
    event GradeSystemTransferred(
        uint256 gradesystemId,
        address from,
        address to
    );

    modifier onlyOwnerOf(uint256 _gradesystemId) {
        require(
            teacher[_gradesystemId] == msg.sender,
            "You do not own this certificate"
        );
        _;
    }
    // Create a new certificate (NFT)
    function issueGradeSystem(
        string memory _lesson,
        string memory _student,
        string memory _grade,
        string memory _studentnumber
    ) external {
        gradesystemsCounter++;
        uint256 gradesystemId = gradesystemsCounter;

        gradesystems[gradesystemId] = GradeSystem({
            lesson: _lesson,
            student: _student,
            studentnumber: _studentnumber,
            grade: _grade,
            teacher: msg.sender,
            issueDate: block.timestamp
        });
        teacher[gradesystemId] = msg.sender;
        gradesystemnote[msg.sender].push(gradesystemId);

        emit GradeSystemIssued(
            gradesystemId,
            msg.sender,
            _lesson,
            _student,
            _studentnumber,
            _grade,
            block.timestamp
        );
    }
    function getGradeSystemDetails(
        uint256 _gradesystemId
    ) external view returns (GradeSystem memory) {
        return gradesystems[_gradesystemId];
    }

    function transferGradeSystem(
        uint256 _gradesystemId,
        address _to
    ) external onlyOwnerOf(_gradesystemId) {
        address from = teacher[_gradesystemId];
        teacher[_gradesystemId] = _to;
        // Remove certificate from the sender's list
        uint256[] storage senderCertificates = gradesystemnote[from];
        for (uint256 i = 0; i < senderCertificates.length; i++) {
            if (senderCertificates[i] == _gradesystemId) {
                senderCertificates[i] = senderCertificates[
                    senderCertificates.length - 1
                ];
                senderCertificates.pop();
                break;
            }
        }

        // Add certificate to the receiver's list
        gradesystemnote[_to].push(_gradesystemId);

        emit GradeSystemTransferred(_gradesystemId, from, _to);
    }
    function getUserGradeSystem(
        address _user
    ) external view returns (uint256[] memory) {
        return gradesystemnote[_user];
    }
}
