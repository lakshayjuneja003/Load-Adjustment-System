import axios from "axios";

const MakeNewVerificationRequest = () => {
    
    const makerequest = async () => {
        console.log(localStorage.getItem("token"));
        
        try {
            const response = await axios.put(
                'http://localhost:3004/api/v1/user/putverificationrequest',
                {}, // Empty data for the PUT request
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                  withCredentials: true,
                }
            );
            console.log(response);
              
        } catch (error) {
            console.log(error);
        }
    };
   
    return (
        <>
            <div>
                You can send another request to admin to approve if admin has rejected you!
            </div>
            <button onClick={makerequest}>
                Send Another Request
            </button>
        </>
    );
};

export default MakeNewVerificationRequest;
