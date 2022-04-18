# -*- coding: utf-8 -*-
{
    'name' : 'Contact Whatsapp Message',
    'version' : '1.1',
    'summary': 'Contact Whatsapp Message',
    'sequence': -10,
    'description': """Contact Whatsapp Message""",
    'category': 'Accounting/Accounting',
    'website': 'https://www.odoo.com/page/billing',
    'depends' : [],
    'data': [
        'security/ir.model.access.csv',
        'wizard/message.xml',
        'views/makebutton.xml',

    ],
    'demo': [],
    'qweb': [],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
