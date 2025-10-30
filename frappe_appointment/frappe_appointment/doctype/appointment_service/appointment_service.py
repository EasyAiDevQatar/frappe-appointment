# Copyright (c) 2025, Ebkar – Technology & Management Solutions and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class AppointmentService(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		description: DF.SmallText | None
		duration: DF.Int
		enabled: DF.Check
		price: DF.Currency
		service_name: DF.Data
	# end: auto-generated types

	pass

