 API Reference
Create Webhook
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


const { data, error } = await resend.webhooks.create({
  endpoint: 'https://example.com/handler',
  events: ['email.sent'],
});
Retrieve Webhook
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


const { data, error } = await resend.webhooks.get(
  '5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d',
);
Update Webhook
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


const { data, error } = await resend.webhooks.update(
  '5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d',
  {
    endpoint: 'https://new-webhook.example.com/handler',
    events: ['email.sent', 'email.delivered'],
    status: 'enabled',
  },
);
List Webhooks
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


const { data, error } = await resend.webhooks.list();
Delete Webhook
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


const { data, error } = await resend.webhooks.remove(
  '5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d',
); > PI Reference
Create Contact
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


const { data, error } = await resend.contacts.create({
  email: 'steve.wozniak@gmail.com',
  firstName: 'Steve',
  lastName: 'Wozniak',
  unsubscribed: false,
});
Get Contact
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


// Get by contact id
await resend.contacts.get('5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d');


// Get by contact email
await resend.contacts.get({
  email: 'steve.wozniak@gmail.com',
});
Update Contact
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


// Update by contact id
await resend.contacts.update({
  id: '5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d',
  firstName: 'Steven',
  unsubscribed: true,
});


// Update by contact email
await resend.contacts.update({
  email: 'steve.wozniak@gmail.com',
  firstName: 'Steven',
  unsubscribed: true,
});
Delete Contact
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


// Delete by contact id
await resend.contacts.remove('5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d');


// Delete by contact email
await resend.contacts.remove({
  email: 'steve.wozniak@gmail.com',
});
List Contacts
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.contacts.list({
  limit: 10,
}); > API Reference
Create Template
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.templates.create({
  name: 'order-confirmation',
  html: '<p>Name: {{{PRODUCT}}}</p><p>Total: {{{PRICE}}}</p>',
  variables: [
    {
      key: 'PRODUCT',
      type: 'string',
      fallbackValue: 'item',
    },
    {
      key: 'PRICE',
      type: 'number',
      fallbackValue: 20,
    },
  ],
});


// Or create and publish a template in one step
await resend.templates.create({ ... }).publish();
Get Template
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.templates.get('5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d');
Update Template
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.templates.update('5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d', {
  name: 'order-confirmation',
  html: '<p>Total: {{{PRICE}}}</p><p>Name: {{{PRODUCT}}}</p>',
});
Publish Template
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.templates.publish('5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d');
Duplicate Template
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.templates.duplicate('5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d');
Delete template
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.templates.remove('5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d');
List Templates
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.templates.list({
  limit: 2,
  after: '5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d',
}); > API Reference
Create Broadcast
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.broadcasts.create({
  segmentId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
  from: 'Acme <onboarding@resend.dev>',
  subject: 'hello world',
  html: 'Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}',
});
Retrieve Broadcast
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.broadcasts.get('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
Update Broadcast
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.broadcasts.update("559ac32e-9ef5-46fb-82a1-b76b840c0f7b", {
  html: "Hi {{{FIRST_NAME|there}}}, you can unsubscribe here: {{{RESEND_UNSUBSCRIBE_URL}}}",
});
Send Broadcast
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.broadcasts.send('559ac32e-9ef5-46fb-82a1-b76b840c0f7b', {
  scheduledAt: 'in 1 min',
});
Delete Broadcast
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.broadcasts.remove('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
List Broadcasts
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.broadcasts.list(); API Reference
Send Email
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['delivered@resend.dev'],
  subject: 'hello world',
  html: '<p>it works!</p>',
});
Send Batch Emails
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


await resend.batch.send([
  {
    from: 'Acme <onboarding@resend.dev>',
    to: ['foo@gmail.com'],
    subject: 'hello world',
    html: '<h1>it works!</h1>',
  },
  {
    from: 'Acme <onboarding@resend.dev>',
    to: ['bar@outlook.com'],
    subject: 'world hello',
    html: '<p>it works!</p>',
  },
]);
Retrieve Email
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


resend.emails.get('5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d');
Update Email
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


const oneMinuteFromNow = new Date(Date.now() + 1000 * 60).toISOString();


resend.emails.update({
  id: '5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d',
  scheduledAt: oneMinuteFromNow,
});
Cancel Email
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


resend.emails.cancel('5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d');
List Emails
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


const { data, error } = await resend.emails.list();
List Attachments
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


const { data, error } = await resend.emails.attachments.list({
  emailId: '5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d',
});
Retrieve Attachment
import { Resend } from 'resend';


const resend = new Resend('re_xxxxxxxxx');


const { data, error } = await resend.emails.attachments.get({
  id: '4a90a90a-90a9-0a90-a90a-90a90a90a90a',
  emailId: '5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d',
});