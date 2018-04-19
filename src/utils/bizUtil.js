export default {
  /**
   * 目前只使用了其中四个模板，这个方法从所有模板中提取出这四个模板，以后需要使用那个模板，直接修改这个方法即可
   * 该接口使用手机端的getCoverList_phone接口，获取到的allTemplate的结构上这样的
   * {
   *    "front": [...],
   *    "normal" {
   *        "空白模板": [
   *             {"id": xxxx, "name": "空白模板", "cover": "https://images.timetask.cn/xxxxxx.png"}
   *        ],
   *        "企业管理": [...],
   *        "产品研发": [
   *            {"id": xxxx, "name": "Roadmap", "cover": "https://images.timetask.cn/xxxxxx.png"},
   *            {"id": xxxx, "name": "需求管理", "cover": "https://images.timetask.cn/xxxxxx.png"},
   *            {"id": xxxx, "name": "产品设计", "cover": "https://images.timetask.cn/xxxxxx.png"},
   *            {"id": xxxx, "name": "敏捷开发", "cover": "https://images.timetask.cn/xxxxxx.png"},
   *            {"id": xxxx, "name": "Bug管理", "cover": "https://images.timetask.cn/xxxxxx.png"}
   *        ],
   *        "电子商务": [...],
   *        ...
   *    }
   * }
   * @param allTemplate
   */
  extractTemplate (allTemplate) {
    const templateArray = []
    if (!allTemplate['normal']) {
      return
    }
    if (allTemplate['normal']['空白模板'] && allTemplate['normal']['空白模板'].length > 0) {
      templateArray.push(allTemplate['normal']['空白模板'][0])
    }
    if (allTemplate['normal']['产品研发'] && allTemplate['normal']['产品研发']) {
      const templateToFind = ['敏捷开发', '产品设计', '需求管理']
      const targetArray = allTemplate['normal']['产品研发']
      targetArray.forEach(template => {
        if (templateToFind.indexOf(template.name) !== -1) {
          templateArray.push(template)
        }
      })
    }
    return templateArray
  }
}
