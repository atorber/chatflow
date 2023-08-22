/* eslint-disable sort-keys */

/*
定义一个活动管理接口，至少包含以下几个动作，给出ts示例代码：
获取活动列表
获取活动详情
发布活动
取消活动
停止活动报名
报名活动
取消报名活动
活动订单查询
*/

interface Participant {
    id: string;
    name: string;
    email: string;
  }

  interface Activity {
    id: string;
    name: string;
    description: string;
    date: Date;
    location: string;
    participants: Participant[];
  }

  interface Order {
    id: string;
    activityId: string;
    participantId: string;
    status: string;
    // Other order details
  }

  interface ActivityManagement {
    getActivityList(): Activity[];
    getActivityDetails(activityId: string): Activity | null;
    createActivity(activity: Activity): void;
    cancelActivity(activityId: string): void;
    stopRegistration(activityId: string): void;
    registerActivity(activityId: string, participant: Participant): void;
    cancelRegistration(activityId: string, participantId: string): void;
    getActivityOrders(activityId: string): Order[];
  }

// Implement the ActivityManagement interface
class ActivityManager implements ActivityManagement {

  private activities: Activity[] = []
  private orders: Order[] = []

  getActivityList (): Activity[] {
    return this.activities
  }

  getActivityDetails (activityId: string): Activity | null {
    const activity = this.activities.find((activity) => activity.id === activityId)
    return activity || null
  }

  createActivity (activity: Activity): void {
    this.activities.push(activity)
  }

  cancelActivity (activityId: string): void {
    this.activities = this.activities.filter((activity) => activity.id !== activityId)
  }

  stopRegistration (activityId: string): void {
    const activity = this.activities.find((activity) => activity.id === activityId)
    if (activity) {
      // Perform necessary actions to stop registration
    }
  }

  registerActivity (activityId: string, participant: Participant): void {
    const activity = this.activities.find((activity) => activity.id === activityId)
    if (activity) {
      activity.participants.push(participant)
    }
  }

  cancelRegistration (activityId: string, participantId: string): void {
    const activity = this.activities.find((activity) => activity.id === activityId)
    if (activity) {
      activity.participants = activity.participants.filter((participant) => participant.id !== participantId)
    }
  }

  getActivityOrders (activityId: string): Order[] {
    return this.orders.filter((order) => order.activityId === activityId)
  }

}

// Usage example
const activityManager = new ActivityManager()

// Create a new activity
const newActivity: Activity = {
  id: '1',
  name: 'Badminton Tournament',
  description: 'Join our annual badminton tournament!',
  date: new Date('2022-10-15'),
  location: 'Sports Center',
  participants: [],
}
activityManager.createActivity(newActivity)

// Get the activity list
export const activityList = activityManager.getActivityList()

// Get activity details
export const activityDetails = activityManager.getActivityDetails('1')

// Register for an activity
const participant: Participant = {
  id: '1',
  name: 'John Doe',
  email: 'johndoe@example.com',
}
activityManager.registerActivity('1', participant)

// Cancel registration for an activity
activityManager.cancelRegistration('1', '1')

// Cancel an activity
activityManager.cancelActivity('1')

// Get activity orders
export const activityOrders = activityManager.getActivityOrders('1')

const a = 0

export {
  a,
}
