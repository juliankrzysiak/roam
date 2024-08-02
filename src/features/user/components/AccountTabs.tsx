"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountForm from "./Forms/AccountForm";
import PasswordForm from "./Forms/PasswordForm";
import DeleteForm from "./Forms/DeleteForm";

type Props = {
  name: string;
  email: string;
  isAnonymous: boolean;
};

export default function AccountTabs({ name, email, isAnonymous }: Props) {
  return (
    <Tabs defaultValue="account" className="w-full max-w-xl">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="delete">Delete</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. If you change your email a
              confirmation email will be sent to the provided address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountForm name={name} email={email} isAnonymous={isAnonymous} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. You will be signed out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm isAnonymous={isAnonymous} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="delete">
        <Card className="border-2 border-dashed border-red-600 ">
          <CardHeader>
            <CardTitle>Delete</CardTitle>
            <CardDescription>
              Irreversibly delete your data and/or account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <DeleteForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
