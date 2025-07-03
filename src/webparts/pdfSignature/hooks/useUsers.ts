import { MSGraphClientV3 } from "@microsoft/sp-http";
import { useEffect, useState } from "react";

export interface IUser {
  id: string;
  displayName: string;
  mail: string;
}

export const useUsers = (msGraphClientFactory: any) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    msGraphClientFactory
      .getClient("3")
      .then((client: MSGraphClientV3) =>
        client.api("/users").version("v1.0").get()
      )
      .then((response: { value: IUser[] }) => {
        setUsers(response.value);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Failed to fetch users", err);
        setLoading(false);
      });
  }, [msGraphClientFactory]);

  return { users, loading };
};
