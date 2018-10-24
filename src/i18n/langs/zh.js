import zhLocale from 'element-ui/lib/locale/lang/zh-CN' //引入element语言包
const zh = {
  message: {
    /*登陆页面*/
    'AccountName':'用户名',
    'lessonCode':'上课码',
    'Pleasecontact':'请联系管理员',
    'Student':'学生',
    'Admin':'管理员',
    'Login':'登录',
    'Forgotyourpassword':'忘记密码',
    'Loginuserisnotateacher':'登录用户不是教师',
    'Loginuserisnotamanager':'登录用户不是管理员',
    'Loginuserisnotastudent':'登录用户不是学生',



    'Welcome':'欢迎',
    'text': '欢迎登陆！',
    'newlesson':'给新课建个名字',
    'mycourse':'我的课程',
    'TeacherManagement':'教师管理',
    'totalQuantity':'总数量',
    'step':'步骤',
    'addcourse':'将新课添加到现有课程中',
    'orcreate':'或者，在这里创建一个新的课程。',
    'pleaseselect':'请选择',
    'pleaseenter':'请输入',
    'list':'列表',
    'Select':'列表',
    'Next':'下一步',
    'Continue':'继续',
    'giveup':'放弃',
    'quite':'你有被编辑、继续或放弃吗？',
    'Empty':'请添加',
    'SelectaLesson':'选择课时',
    'pleaseinformation':'请先选择课时资料.',
    'Pleaseselectalesson':'请选择一节课',
    'Pleaseselectmaterial':'请选择材料',
    'CopySuccess':'复制成功',
    'CreateaDiscussion':'创建讨论',
    'NewDiscussion':'新建讨论',
    'Enterdiscussion':'在这里输入讨论内容.',
    'AddAttachments':'添加附件',
    'CreateAnExercise':'创建练习',
    'Order':'排序',
    'Typequestion':'在这里输入问题...',
    'Option':'添加选项',
    'Pleasetick':'请勾选出正确答案。(所选择项为正确答案)',
    'Explanations':'输入解释说明',
    'CreateanAssignment':'创建作业',
    'NewAssignment':'新建作业',
    'Pleasemodify':'请选择修改课程.',
    'pleasestart':'请选择一节课开始上课.',
    'continue':'继续上课',
    'start':'开始上课',
    'ModifyPassword':'修改密码',
    'Password':'密码',
    'NewPassword':'新密码',
    'ConfirmPassword':'确认密码',
    'Pleaseenteroldpassword':'请输入密码',
    'Pleaseenternewpassword':'请输入新密码',
    'Pleaseenternewpasswordagain':'请再次输入新密码',
    'Newpasswordnotmatchtheconfirmpassword':'新密码与确认密码不匹配',
    'Passwordmodificationsucceeded':'密码修改成功!',
    'Lesson':'课时',
    'Course':'课程',
    'Teacher':'老师',
    'DateTime':'日期时间',
    'Publish':'发布',
    'quantity':'数量',
    'Classisover':'下课！',
    'Sharematerialsuccess':'共享材料成功!',
    'Pleaseselectmaterialtoshare':'请选择材料共享!',
    'LogoutSuccess':'登录成功',
    'Captureprojectionfail':'屏幕截图失败',
    'ObjectProjection':'屏幕投影',
    'Yourbrowserdosenotsupportobjectprojection':'浏览器不支持此投影！',
    'Studentpresence':'上课学生名单',
    'Totalattendance':'总出勤率',
    'canvas':'该浏览器不支持canvas.',
    'Attendance':'出勤',
    'Markpen':'画笔',
    'Viewmylessons':'看我的功课',
    'Endtheclass':'下课',
    'Noanswerrecords':'无应答记录',
    'Tips':'提示',
    'SelectCourse':'课程列表',
    'Pleaseselectacoursefirst':'请先选择课程',
    'Pleaseinputcoursenamefirst':'请先输入课程名称',
    'Pleaseinputlessonnamefirst':'请先输入课时名称',
    'Unpublished':'未发布的',
    'Submitthelesson':'提交课程，你可以在“管理所有课程”中找到它。',
    'Deletethelesson':'删除本课下的课程和所有数据。',
    'coursename':'课程名称',
    'NameS':'名称',
    'Thetitlemustbenotempty':'标题不能为空',
    'Theoptionsmustbegreater':'选项必须大于1，小于11。',






    /*teacher center*/
    'back':'返回',
    'Author':'作者',
    'Published':'发布',
    'Started':'开始',
    'Over':'结束',
    'Tobeinclass':'待上课',
    'Haveinhand':'进行中',
    'Finished':'已结束',
    'Pleaseinputfilenametosearch':'请输入文件名查询',
    'Uploads':'上传文件',
    'Categorys':'资源分类',
    'Size':'文件大小',
    'Views':'浏览次数',
    'Modify':'修改',
    'Pleaseselectatleastonerowofdata':'请选择至少一行数据',
    'Description':'意见描述',
    'TimeofDisposal':'处理时间',
    'reportedon':'报道',
    'Replied':'回复',
    'Pleaseinputreplycontent':'请输入回复内容',
    'Pleaseuploadfilefirst':'请先上传文件',
    'Pleaseinputresourcename':'请输入资源名称',
    'ResourceName':'资源名称',
    'Pleaseselectcategory':'请选择类别',
    'Pleaseinputresourcedescription':'请输入资源描述',
    'assignmentSaveNeedContentOrAttachmentNotEmpty': '没有内容或附件不能保存',
    'Replacethefile':'替换文件',



    /*student*/
    'preview':'预览',
    'Thefunctionisbeingperfected':'功能正在完善',
    'ThepreviewfilefailedPleasedownloadittoviewitlocally':'预览文件失败，请下载至本地查看',
    'CorrectAnswer':'正确答案',
    'YourAnswer':'你的答案',
    'lastpage':'抱歉，这是最后一页!',
    'firstpage':'抱歉，这是第一页!',
    'SubmitSuccess':'提交成功',
    'submission':'答题成功!',
    'download':'下载',
    'pleaseEnter':'请输入内容',
    'LearningMaterial':'学习材料',
    'Exercise':'练习',
    'Pleaseselectamaterialfirst':'请先选择材料',
    'question':'问题答案已提交!',



    /*admin*/
    'Download':'下载导入模板',
    'Import':'导入老师数据',
    'ResetPassword':'重置初始化密码',
    'Account':'账号',
    'Name':'姓名',
    'EMail':'邮箱',
    'Phone':'联系电话',
    'Category':'分类',
    'updateTime':'日期',
    'Status':'状态',
    'Operation':'操作',
    'Total':'总数量',
    'plfrom':'请输入反馈人姓名查询',
    'plStatus':'请选择状态检索',
    'startdata':'开始日期',
    'enddata':'结束日期',
    'to':'至',
    'feedback':'意见描述',
    'from':'反馈人',
    'fromdata':'反馈时间',
    'Disposaltime':'处理时间',
    'Studentname':'请输入学生姓名查询',
    'importdata':'导入学生数据',
    'major': '专业',
    'class': '班级',
    'teacherEdit': '老师信息编辑',
    'batchUpload': '批量上传',
    'createUser': '创建人',
    'fileSize': '文件大小',
    'fileName': '文件名',
    'viewNumber': '浏览次数',
    'upload': "上传",
    'resourceName': "资源名称",
    'resourceDesc': "资源描述",
    'replaceFile': "替换文件",
    'reply': "反馈",
    'replied': "已反馈",
    'notReplied': "待反馈",
    'opinion': "意见反馈",
    'reportedOn': "反馈于",
    'CourseName':'课程名称',
    'lessonName': "课时名称",
    'course': "课程",
    'recovery': '恢复',
    'importTeacherData': "导入教师数据",
    'importStudentData': "导入学生数据",
    'overwriteExistsData': "覆盖已存在的数据",
    'importDataSuccess': "导入数据成功",
    'classcode':'上课码',
    'SendTo':'发送给学生',
    'TeachingMaterials':'教材及辅导资料',
    'Discussion':'讨论',
    'Exercises':'练习',
    'Assignment':'作业',
    'lesson':'课时',
    'Singlechoice':'单选',
    'Multiplechoice':'多选',
    'AnswerExplanation':'答案 & 解析',
    'answer':'答案',
    'Explanation':'解析',
    'Responses':'回答',
    'NewLesson':'备课',
    'CourseManagement':'课程管理',
    'StartAClass':'上课',
    'History':'历史记录',
    'Modifyteachersuccess':'修改成功',
    'Modifyteacherfail':'修改失败',
    'Pleaseuploadfile':'请上传文件',
    'Resetuserspasswordsuccess':'重置用户密码成功',
    'Resetuserspasswordfail':'重置用户密码失败',
    'Studentinformationeditor':'学生信息编辑',
    'Modifystudentsuccess':'修改成功',
    'Modifystudentfail':'修改失败',
    'Importstudentdatasuccess':'导入学生数据成功',
    'medin':'Medin',
    'Replysuccess':'回复成功',
    'Forarequireditem':'为必填项',
    'lessonname':'课时名称',



    "logoutSuccess": "登出成功",
    "logoutFail": "登出失败",

    "pleaseSelectLeastOneRowOfData": "请至少选择一行数据",

    'onlySupportFileType': '仅支持文件类型: ',
    'Anerroroccurredinrequest':'请求出现错误',
    'Filetypeisnotsupportpreview':'文件类型不支持预览',

    // 管理端菜单
    // -------- start -----------
    'teacherManagement': '教师管理',
    'studentManagement': '学生管理',
    'resourceManagement': '资源管理',
    'curriculumRecovery': '课程找回',
    'opinionManagement': '意见管理',
    'MyCourse':'我的课程',
    'MyResources':'我的资源',
    'MyOpinion':'我的意见',
    'mycourses':'个人中心',
    'help':'帮助',
    'Quit':'退出',
    // -------- end -----------

    // 通用按钮
    // -------- start -----------
    'SelectAll':'选择全部',
    'batchdelete':'批量删除',
    'CopyTo':'复制到',
    'OK':'确定',
    'checkall':'全选',
    'close':'关闭',
    'submit':'提交',
    'disable': '禁用',
    'enable': '启用',
    'edit': '编辑',
    'update': "更新",
    'delete': '删除',
    'add': '新增',
    'confirm': '确定',
    'cancel': '取消',
    'save': "保存",
    'tip': "提示",
    'confirmDelete': "确认删除?",
    'deleteSuccess': "删除成功",
    "success": "成功",
    'enter':'进入',
    'Top':'顶部',
    'Bottom':'底部',
    'Up':'上移',
    'Down':'下移',



    // -------- end -----------
  },
  ...zhLocale
}

export default zh;
