describe("Basic User Flow", () => {
  beforeEach(() => {
    // Reset and seed the database before each test
    // This would typically be done through a custom command that calls your API
    cy.visit("/");
  });

  it("should allow user to log in and view dashboard", () => {
    // Assuming we have a test user in the database
    cy.get("[data-cy=email-input]").type("test@example.com");
    cy.get("[data-cy=password-input]").type("testpassword");
    cy.get("[data-cy=login-button]").click();

    // Should be redirected to dashboard
    cy.url().should("include", "/dashboard");
    cy.get("[data-cy=welcome-message]").should("be.visible");
  });

  it("should display task details and allow commenting", () => {
    // Assuming we're logged in and have a test task
    cy.visit("/tasks/test-task-id");

    // Check task details are displayed
    cy.get("[data-cy=task-title]").should("be.visible");
    cy.get("[data-cy=task-description]").should("be.visible");

    // Add a comment
    cy.get("[data-cy=comment-input]").type("Test comment");
    cy.get("[data-cy=submit-comment]").click();

    // Verify comment appears
    cy.get("[data-cy=comments-list]").should("contain", "Test comment");
  });

  it("should allow sending chat messages", () => {
    // Visit a test chat
    cy.visit("/chats/test-chat-id");

    // Send a message
    cy.get("[data-cy=message-input]").type("Hello, this is a test message");
    cy.get("[data-cy=send-message]").click();

    // Verify message appears
    cy.get("[data-cy=messages-list]").should(
      "contain",
      "Hello, this is a test message"
    );
  });

  it("should handle document upload and viewing", () => {
    cy.visit("/documents");

    // Upload a test document
    cy.get("[data-cy=file-input]").attachFile("test-document.pdf");
    cy.get("[data-cy=upload-button]").click();

    // Verify document appears in list
    cy.get("[data-cy=documents-list]").should("contain", "test-document.pdf");

    // View document details
    cy.get("[data-cy=document-link]").first().click();
    cy.url().should("include", "/documents/");
  });

  it("should display and mark notifications as read", () => {
    cy.visit("/notifications");

    // Check for notifications
    cy.get("[data-cy=notifications-list]").should("be.visible");

    // Mark a notification as read
    cy.get("[data-cy=mark-read-button]").first().click();

    // Verify notification is marked as read
    cy.get("[data-cy=unread-notification]")
      .first()
      .should("have.class", "bg-white");
  });
});
