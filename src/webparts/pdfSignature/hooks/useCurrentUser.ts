import { MSGraphClientFactory, MSGraphClientV3 } from "@microsoft/sp-http";
import { useEffect, useState } from "react";

export interface ICurrentUser {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  givenName?: string;
  surname?: string;
  jobTitle?: string;
  mobilePhone?: string;
  officeLocation?: string;
}

interface UseCurrentUserResult {
  user: ICurrentUser | undefined;
  loading: boolean;
  error: string | undefined;
}

export const useCurrentUser = (
  msGraphClientFactory: MSGraphClientFactory
): UseCurrentUserResult => {
  const [user, setUser] = useState<ICurrentUser | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async (): Promise<void> => {
      try {
        const client: MSGraphClientV3 = await msGraphClientFactory.getClient(
          "3"
        );
        const response = await client.api("/me").version("v1.0").get();

        if (isMounted) {
          const currentUser: ICurrentUser = {
            id: response.id,
            displayName: response.displayName,
            mail: response.mail,
            userPrincipalName: response.userPrincipalName,
            givenName: response.givenName,
            surname: response.surname,
            jobTitle: response.jobTitle,
            mobilePhone: response.mobilePhone,
            officeLocation: response.officeLocation,
          };

          setUser(currentUser);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch current user", err);
        if (isMounted) {
          setError("Failed to fetch user");
          setLoading(false);
        }
      }
    };

    fetchUser().catch((err) => {
      console.error("Unhandled error in fetchUser:", err);
    });

    return () => {
      isMounted = false;
    };
  }, [msGraphClientFactory]);

  return { user, loading, error };
};
