"""empty message

Revision ID: b9ba0c0eeab6
Revises: ec2367d9c655
Create Date: 2025-02-26 16:34:37.593985

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b9ba0c0eeab6'
down_revision = 'ec2367d9c655'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('companies', schema=None) as batch_op:
        batch_op.alter_column('id',
               existing_type=sa.TEXT(),
               type_=sa.Integer(),
               existing_nullable=False,
               autoincrement=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('companies', schema=None) as batch_op:
        batch_op.alter_column('id',
               existing_type=sa.Integer(),
               type_=sa.TEXT(),
               existing_nullable=False,
               autoincrement=True)

    # ### end Alembic commands ###
