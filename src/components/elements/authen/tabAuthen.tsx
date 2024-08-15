import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Login from "./login"
import Register from "./singup"

 
const TabAuthen = () => {
  return (
    <Tabs defaultValue="login" className="w-[500px] ">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Đăng Nhập</TabsTrigger>
        <TabsTrigger value="singup">Đăng Ký</TabsTrigger>
      </TabsList>
      <TabsContent defaultChecked value="login">
        <Card>
        <Login/>
        </Card>
      </TabsContent>
      <TabsContent value="singup">
        <Card>
          <Register/>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
export default TabAuthen