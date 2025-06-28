"""service_options에 package_price 추가

Revision ID: 0d9998b40ddc
Revises: a25956e835d0
Create Date: 2025-06-25 16:19:19.244957

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0d9998b40ddc'
down_revision = 'a25956e835d0'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('service_options', schema=None) as batch_op:
        batch_op.add_column(sa.Column('package_price', sa.Integer(), nullable=True))


def downgrade():
    with op.batch_alter_table('service_options', schema=None) as batch_op:
        batch_op.drop_column('package_price')