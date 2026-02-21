# Ported Number Payment Risk Ghost Wallet 👻📱💸
A visual proof-of-concept showing how **one phone number can silently belong to two mobile money wallets after number portability.**

> You send money → receiver never sees it → system says successful.

The telecom identity updates.
The payment identity does not.

Result → funds arrive in a hidden legacy wallet.

---

## The Problem In One Sentence

After porting a number, communication follows the new network —
but money can still follow the old wallet.

Two financial realities exist for one phone number.

---
<img width="1364" height="557" alt="image" src="https://github.com/user-attachments/assets/4daa15b4-08d2-48b0-a5dd-9da3cff911c4" />
<img width="1359" height="567" alt="image" src="https://github.com/user-attachments/assets/0e9fef89-275f-4270-9b31-d9a8d4b293f7" />
<img width="1361" height="574" alt="image" src="https://github.com/user-attachments/assets/2d8017a1-a685-49ff-8845-29d546ee8eab" />
<img width="1363" height="575" alt="image" src="https://github.com/user-attachments/assets/1c0a59f2-970f-46e9-b12d-f891ebe5421c" />
<img width="1362" height="601" alt="image" src="https://github.com/user-attachments/assets/0c441282-46b4-4db4-b29f-7d91955c2869" />

## What This Demo Shows

| What You Expect                  | What Actually Happens              |
| -------------------------------- | ---------------------------------- |
| Money goes to new network wallet | Money goes to old wallet           |
| Receiver notified                | Receiver unaware                   |
| Transfer verified                | Transfer misleadingly “successful” |

---

## The Identity Split

| Layer       | Destination               |
| ----------- | ------------------------- |
| Calls & SMS | New Network (ported)      |
| Payments    | Old Wallet (still active) |

**One number. Two identities.**

---

Now replace the **"Why This Matters"** section too (more impactful wording):

## Why This Matters

Mobile money systems assume:

> A phone number represents a single financial identity.

Number portability breaks that assumption.

The system remains operational, but trust is compromised.

Money is not lost —
**it is delivered to a place the receiver no longer knows exists.**

---

And finally tighten the ending:

## Goal

This project is an awareness demonstration.

It highlights the need for:

* wallet ownership synchronization
* transparent routing behavior
* idempotent financial delivery guarantees
* explicit user notification during number porting

Not a complaint.
A system behavior illustration.

---
