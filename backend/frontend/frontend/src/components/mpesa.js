import axios from "axios";
import React, {useState} from "react";

const MpesaPay = () =>{
    const [phone, setPhone] = useState();
    const [amount, setAmmount] = useState();

    const pay = async () =>{
        try {
            const res = await axios.post("http://127.0.0.1:8000/store/stk-push/",{
                phone,
                amount
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            });
            alert("STK push sent");
            console.log(res.data);
        } catch (err) {
            console.error(err);
            alert("payment Failed");
        }
    };

    return (
        <div>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone(07...)" />
            <input type="number" value={amount} onChange={e => setAmmount(e.target.value)} placeholder="Amount" />
            <button onClick={pay}>Pay With Mpesa</button>
        </div>
    );
}
export default MpesaPay;