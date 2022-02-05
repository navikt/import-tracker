const t = "test";

test("should equal true", () => {
  expect(t).toBe("test");
});

test("should fail ", () => {
  expect(t).toBe("test");
});
