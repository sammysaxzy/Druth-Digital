export function getSubscribeFormTemplate() {
  return `
    <form class="form-shell" id="subscribe-form" novalidate>
      <div class="form-row">
        <div class="form-group">
          <label for="subscribe-name">Full Name</label>
          <input class="input-field" type="text" id="subscribe-name" name="name" required>
        </div>
        <div class="form-group">
          <label for="subscribe-email">Email</label>
          <input class="input-field" type="email" id="subscribe-email" name="email" required>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="subscribe-phone">Phone</label>
          <input class="input-field" type="tel" id="subscribe-phone" name="phone" required>
        </div>
        <div class="form-group">
          <label for="subscribe-address">Address</label>
          <input class="input-field" type="text" id="subscribe-address" name="address" required>
        </div>
      </div>
      <div class="form-group">
        <label for="subscribe-plan">Selected Plan</label>
        <input class="input-field" type="text" id="subscribe-plan" name="plan" readonly>
      </div>
      <div class="form-group">
        <label for="subscribe-notes">Notes</label>
        <textarea class="textarea-field" id="subscribe-notes" name="notes"></textarea>
      </div>
      <button class="btn-primary" type="submit">Submit Request</button>
    </form>
  `;
}

