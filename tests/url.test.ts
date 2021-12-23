import BestURL from "@/utils/BestURL";
test("url 取值", () => {
  expect(new BestURL("aa.aa.com?aa=是个").getParams("aa")).toBe("是个");
  expect(new BestURL("aa.aa.com#/a?aa=是打广告&").getParams("aa")).toBe("是打广告");
  expect(new BestURL("aa.aa.com#?aa=是打广告&aa=2&?aa").getParams("aa")).toBe("是打广告");
  expect(new BestURL("aa.aa.com#?aa=1&aa=2&?aa=1#?B=是打广告").getParams("B")).toBe("是打广告");
  expect(new BestURL("aa.aa.com#?aa=1&aa=2&?aa=1#").getParams("bb")).toBeUndefined();
  expect(new BestURL("aa.aa.com#?aa=&?bb=1#").getParams("aa")).toBe("");
  expect(new BestURL("aa.aa.com#?aa=&?bb=1#").getParams("")).toBeUndefined();
  expect(new BestURL("aa.aa.com#?aa=&?bb=1#").getParams(undefined)).toBeUndefined();
  expect(new BestURL("").getParams("aa")).toBeUndefined();
  expect(new BestURL(undefined).getParams("aa")).toBeUndefined();
});

test("url 修改值", () => {
  expect(new BestURL("aa.aa.com?aa=傻大个十大#11").setParams("aa", 11)).toBe("aa.aa.com?aa=11#11");
  expect(new BestURL("aa.aa.com?aa=1&aa=2#11").setParams("aa", 11)).toBe("aa.aa.com?aa=11&aa=11#11");
  expect(new BestURL("aa.aa.com?aa=1&bb=2#11").setParams("aa", 11)).toBe("aa.aa.com?aa=11&bb=2#11");
  expect(new BestURL("aa.aa.com?aa=1#11?bb=1").setParams("bb", 11)).toBe("aa.aa.com?aa=1#11?bb=11");
});

test("url 增加", () => {
  expect(new BestURL("aa.aa.com?aa=1#11").setParams("bb", 11)).toBe("aa.aa.com?aa=1&bb=11#11");
  expect(new BestURL("aa.aa.com").setParams("bb", 11)).toBe("aa.aa.com?bb=11");
  expect(new BestURL("aa.aa.com#1").setParams("bb", 11)).toBe("aa.aa.com#1?bb=11");
  expect(new BestURL(undefined).setParams("aa", 1)).toBe("?aa=1");
  expect(new BestURL("").setParams("aa", 1)).toBe("?aa=1");
});

test("url 删除值", () => {
  expect(new BestURL("aa.aa.com?aa=#11").delParams("aa")).toBe("aa.aa.com#11");
  expect(new BestURL("aa.aa.com?aa=&b=1#11").delParams("aa")).toBe("aa.aa.com?b=1#11");
  expect(new BestURL("aa.aa.com?aa=&b=1#11?aa=456sdf").delParams("aa")).toBe("aa.aa.com?b=1#11");
  expect(new BestURL("aa.aa.com?aa=1#11?aa=456sdf&b=1").delParams("aa")).toBe("aa.aa.com#11?b=1");
  expect(new BestURL("aa.aa.com?aa=1#11").delParams("11")).toBe("aa.aa.com?aa=1#11");
  expect(new BestURL(undefined).delParams("aa")).toBe("");
  expect(new BestURL("").delParams("aa")).toBe("");
});
