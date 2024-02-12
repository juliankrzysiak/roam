"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateAccount, updatePassword } from "@/utils/actions";
import { ChangeEvent, useState } from "react";
import AccountForm from "./AccountForm";

type Props = {
  name: string;
  email: string;
};

export default function AccountTabs({ name, email }: Props) {
  const [disabled, setDisabled] = useState(true);

  function checkSameValue(event: ChangeEvent<HTMLInputElement>) {
    const e = event.target;
    if (e.defaultValue !== e.value) setDisabled(false);
    else setDisabled(true);
  }

  return (
    <Tabs defaultValue="account" className="">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you&apos;re
              done.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountForm name={name} email={email} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you&apos;ll be logged
              out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updatePassword} className="">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" name="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" name="new" type="password" />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
