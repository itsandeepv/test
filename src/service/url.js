export const main = "http://111.93.62.114"
// export const main ="https://expensemgmt.gocoolcare.com/web"
export const loginUrl = {
    userLogin: "/hrms_app/WebService/EmployeeService.asmx/EmployeeLogin",
    employeeRole: 'get-login-grade'
}
export const initUrl = "https://expensemgmt.gocoolcare.com/api/"
export const expenseUrl = {
    initialUrl: "https://expensemgmt.gocoolcare.com",
    addExpense: "/api/create-expense",
    expensePendingList: "/api/get-pending-expenses",
    expenseRejectList: "/api/get-rejected-expenses",
    expenseApproveList: "/api/get-approved-expenses",
    expenseDraftList: "/api/get-draft-expenses",
    getTicketQueryList: "/api/get-ticket-query",
    expenseDetails: "/api/get-expense-details",
    expenseApprove: "/api/approve-expense",
    rejectReason: "/api/reject-expense",
    getExpenseMaster: "/api/admin/get-master-expense",
    updateExpenseMaster: "/api/admin/update-master-expense",
    addExpenseMaster: "/api/admin/add-master-expense",
    getMasterSubExpense: "/api/admin/get-master-subexpense",
    addMasterSubExpense: "/api/admin/add-master-subexpense",
    createTicketQuery: "/api/create-ticket-query",
    getExpenseCount: "/api/get-expense-count",
    recentSubmitted: "/api/get-recent-expenses",
    resumitExpense: "/api/resubmit-expense",
    graphExpense:'get-daily-graph-data'

}

export const expenseQuery = {
    createQuery: "create-ticket-query",
    getQueryList: "get-ticket-query",
    getQueryDetails: "get-ticket-query-details"
}

export const admin = {
    grade: 'admin/grade',
    cityTire: 'admin/city-tier',
    cityList: 'admin/city-list',
    employee: 'admin/employee',
    editEmployee: 'admin/edit-employee',
    updateMasterSubexpense: 'admin/update-master-subexpense',
    getMasterExpenseWithSubexpense: 'admin/get-master-expense-with-subexpense',
    deleteMasterExpense: 'admin/delete-master-expense',
    deleteSubMasterExpense: 'admin/delete-submaster-expense',
    getgradePolicy: 'admin/get-grade-policy',
    editgradePolicy: 'admin/edit-grade-policy',
    getmanagementProfile: 'admin/get-management-profile',
    getHodList: 'admin/get_hod_list',
    mngmnttoHodAssign: 'admin/mgm_to_hod_assign',
    hodtoempAssign: 'admin/hod_to_emp_assign',
    getAllRoles: 'admin/get-roles',
    getExpenseWithSubexpense: 'admin/get-expense-with-subexpense',
    getCreateExpense: 'admin/get-grade-policy-with-subexpense',
    addGradePolicy: 'admin/add-grade-policy',
    deletegradePolicyByGrade: 'admin/delete-grade-policy-by-grade',
    singleEditMasterSubExpense:'admin/single-edit-master-subexpense',
    getemployeeForHodAndMgm : 'admin/get-assiging-employees'
}
export const notification = {
    getNotification: 'get-notification',
}

export const expenseRequest = {
    getTeamRequestExpense: 'get-team-request-expenses'
}
export const violation = {
    acceptRejectViolation: 'accept-reject-policy-violations'
}