import Pusher from "pusher-js";

console.log(process.env.REACT_APP_PUSHER_PUBLIC_KEY!);
const pusher = new Pusher(process.env.REACT_APP_PUSHER_PUBLIC_KEY!, {
  cluster: process.env.REACT_APP_PUSHER_CLUSTER,
});

export default pusher;
