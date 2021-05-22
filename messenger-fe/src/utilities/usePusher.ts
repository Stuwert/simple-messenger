import Pusher from "pusher-js";

import { useEffect, useState } from "react";

export default function useSetUser(
  privateId: string | undefined
): Pusher | undefined {
  const [pusherInstance, setPusherInstance] =
    useState<Pusher | undefined>(undefined);

  useEffect(() => {
    /**
     * Subscribes to the default channel so that if someone
     * messages us we can know about it.
     *
     * We also only want to set up the connection with pusher
     * once we know we're g2g
     */
    if (privateId) {
      const pusher = new Pusher(process.env.REACT_APP_PUSHER_PUBLIC_KEY!);

      pusher.subscribe(privateId);

      setPusherInstance(pusher);
    }
  }, [privateId]);

  return pusherInstance;
}
