"""empty message

Revision ID: 05d18fefd7ad
Revises: fca96b1ea333
Create Date: 2025-03-04 20:54:13.483758

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '05d18fefd7ad'
down_revision = 'fca96b1ea333'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('works', schema=None) as batch_op:
        batch_op.add_column(sa.Column('company_cost_base', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('works', schema=None) as batch_op:
        batch_op.drop_column('company_cost_base')

    # ### end Alembic commands ###
